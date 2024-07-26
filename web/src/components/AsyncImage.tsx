import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "@/providers/AuthContext.tsx";
import {Spinner} from "@/components/Spinner.tsx";

interface AsyncImageProps {
    imageId: number;
}

const AsyncImage: React.FC<AsyncImageProps> = ({ imageId }) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const { authState } = useAuth();

    useEffect(() => {
        const fetchImageUrl = async () => {
            if (!authState?.token) return;

            try {
                const res = await axios.get(`http://localhost:8080/api/v1/files/download/image/${imageId}`, {
                    headers: {
                        Authorization: `Bearer ${authState?.token}`
                    },
                    responseType: 'blob',
                });

                const url = URL.createObjectURL(res.data);
                setImageUrl(url);
            } catch (err) {
                console.error(err);
            }
        };

        fetchImageUrl();
    }, [imageId, authState]);

    return imageUrl ? <img src={imageUrl} alt="test" className="object-cover w-full h-full" /> : <Spinner/>;
};

export default AsyncImage;
