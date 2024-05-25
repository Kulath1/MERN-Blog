import React from 'react';
import { useAds } from '../AdProvider';

const Ads = () => {
    const { ads } = useAds();

    return (
        <div className="flex flex-col gap-4">
            {ads.map((ad) => (
                <div key={ad.id} className="border p-4">
                    <h2 className="text-2xl font-bold">{ad.title}</h2>
                    <img src={ad.image} alt={ad.title} className="w-full h-72 object-cover" />
                </div>
            ))}
        </div>
    );
};

export default Ads;
