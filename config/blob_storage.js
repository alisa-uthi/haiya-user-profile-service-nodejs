const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
  } = require('@azure/storage-blob');

  const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
  const pipeline = newPipeline(sharedKeyCredential);
  
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
  );
  
  const getBlobName = (originalName) => {
    // Use a random number to generate a unique file name, 
    // removing "0." from the start of the string.
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
  };

  module.exports = {
    blobServiceClient: blobServiceClient,
    getBlobName: getBlobName
  }