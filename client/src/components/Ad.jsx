import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link} from "react-router-dom";

export default function Ad({ dependency }) {
  const [ad, setAd] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAd = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/ad/display`);
        if (!res.ok) {
          const data = await res.json();
          console.log(data.message);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setAd(data[0]);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    getAd();
  }, [dependency]);

  if (loading && !ad) {
    return (
      <div className="flex flex-col items-center justify-center my-8">
        <Spinner size="sm" />{" "}
        <p className="text-xs text-gray-500">Advertisement</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <p className="text-xs text-gray-500">Advertisement</p>
      <Link to={ad.targetURL} target="_blank" className="group relative">
        <div className="relative overflow-hidden border-[2px] border-cyan-500 ">
          <img
            src={ad.image}
            alt={ad.title}
            className="max-h-80 w-full object-cover transform transition-transform duration-500 group-hover:scale-105 "
          />
          <div className="absolute inset-0 bg-black bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-white text-xl font-bold mb-2">
              {ad.title}
            </span>
            <span className="text-white mb-2">{ad.content}</span>
            <span className="text-cyan-500 text-sm bg-black bg-opacity-70 p-2 rounded">
              {/*direct to the site given by the targetURL*/} 
              Click Here
            </span>
          </div>
        </div>
      </Link>
      <p className="text-xs text-gray-500">Advertisement</p>
    </div>
  );
}