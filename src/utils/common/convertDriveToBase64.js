import Network from "../../Service/Network";

const api = new Network


export async function convertDriveToBase64(linkDrive) {
    let base64 = '';
    const data = {
        linkDrive: linkDrive
    }
    const response = await api.post('/api/v1/download/pdf/private', data)
    if (response) {
        base64 = response.data.base64;
    }
    return base64;
}