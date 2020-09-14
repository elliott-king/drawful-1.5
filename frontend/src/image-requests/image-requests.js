const createPresignedUrl = async(file, byte_size, checksum) => {
  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: {
        filename: "drawing_from_drawful.png",
        byte_size: byte_size,
        checksum: checksum,
        content_type: 'image/png',
        metadata: {
          'message': 'resume for parsing'
        }
      }
    })
  }
  let res = await fetch(presignedUrl, options)
  if (res.status !== 200) return res
  return await res.json()
}

const createDrawing = async(drawingInfo) => {
  const {file, user_id, prompt_id} = drawingInfo

  // To upload image file to S3, we need to do three steps:
  // 1) request a pre-signed PUT request (for S3) from the backend

  const checksum = await fileChecksum(file)
  const presignedFileParams = await createPresignedUrl(file, file.size, checksum)
  
  // 2) send file to said PUT endpoint (to S3)
  const s3PutOptions = {
    method: 'PUT',
    headers: presignedFileParams.direct_upload.headers,
    body: file,
  }
  let awsRes = await fetch(presignedFileParams.direct_upload.url, s3PutOptions)
  if (awsRes.status !== 200) return awsRes

  // 3) confirm & create drawing with backend
  let usersPostOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: user_id,
      prompt: prompt_id,
      image: presignedFileParams.blob_signed_id,
    })
  }
  let res = await fetch(drawingsUrl, usersPostOptions)
  if (res.status !== 200) return res 
  return await res.json()
}