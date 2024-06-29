import axios from "axios";

export const uploadImage = async (img) => {

    let imgUrl = null;
    await axios
        .get(import.meta.env.VITE_SERVER_URL +"/aws/get-upload-url")
        .then(async ({ data: { uploadUrl }}) => {
            
            console.log("Uploading image to: ", uploadUrl);

            await axios({
                method: "PUT",
                url: uploadUrl,
                headers: {"Content-Type": "multipart/form-data" },
                data: img
            })
            .then(() => {
                console.log("Image uploaded successfully")
                imgUrl = uploadUrl.split("?")[0];
            });
        });

    return imgUrl;
};
