import axios from "axios";

const useImgBB = async(uri, name : string) => {
    try {
        const formData = new FormData();
        formData.append('image', {
          uri,
          type: 'image/jpeg',
          name: name + '.jpg',
        } as any);
  
        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            key: process.env.EXPO_PUBLIC_IMGBB_API_KEY,
          },
        });
  
        // Handle the response from ImgBB
        if (response.data && response.data.data && response.data.data.url) {
          const imageUrl = response.data.data.url;
          return imageUrl;
        } else {
          console.error('Error uploading image to ImgBB');
        }
      } catch (error) {
        console.error('Error uploading image: ', error);
        return error;
      }
}

export default useImgBB;