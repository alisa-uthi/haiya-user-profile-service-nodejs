const { Readable } = require('stream');
const { Request, TYPES } = require('tedious')
const { connection } = require('../config/database')
const { blobServiceClient, getBlobName } = require('../config/blob_storage')

exports.getUserById = async (userId, res) => {
    let result = []
    const query = `SELECT * FROM [dbo].[Person] WHERE ID = @userId`

    const request = new Request(
        query,
        (err) => {
            if (err) return res.status(500).json({ error: err.message })
        }
    );

    request.addParameter('userId', TYPES.NVarChar, userId);

    request.on('row', function (columns) {
        let jsonObj = {}
        columns.map(obj => {
            jsonObj[obj.metadata.colName] = obj.value
        })
        result.push(jsonObj)
    });

    request.on("doneProc", () => {
        return res.status(200).json(result[0])
    })
    
    connection.execSql(request);
}

exports.updateProfileImage = async (req, res) => {
    const blobName = getBlobName(req.file.originalname);
    const stream = Readable.from(req.file.buffer);
    const containerClient = blobServiceClient.getContainerClient('user-image');
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const ONE_MEGABYTE = 1024 * 1024;
    const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

    try {
        // Upload image to Blob storage
        await blockBlobClient.uploadStream(stream,
          uploadOptions.bufferSize, uploadOptions.maxBuffers,
          { blobHTTPHeaders: { blobContentType: "image/jpeg" } });

        const imageUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/user-image/${blobName}`

        // Update user's image URI in SQL database 
        const query = `UPDATE [dbo].[Person]
            SET Psn_Image = @profileImage
            WHERE exists (
                SELECT ID FROM [dbo].[Person] WHERE ID = @userId
            )`

        const request = new Request(
            query,
            (err, rowCount) => {
                if (err) return res.status(500).json({ error: err.message })
                if(rowCount) return res.status(204).json({ message: "Update profile image successfully" })
                return res.status(500).json({ error: "Error occurred when update profile image" })
            }
        );

        request.addParameter('profileImage', TYPES.NVarChar, imageUrl);
        request.addParameter('userId', TYPES.NVarChar, req.params.userId);

        connection.execSql(request);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}