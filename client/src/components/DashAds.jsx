import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button, Table, TableBody, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import "tailwind-scrollbar";


export default function DashAds() {

  const {currentUser} = useSelector(state => state.user)

  const [ads, setAds] = useState([])
  const [showMore, setShowMore] = useState(true)

  const [deleteAdID, setDeleteAdID] = useState('');
  const [showModal, setShowModal] = useState(false)

  const { adId } = useParams();

  useEffect(() => {
    if(currentUser  && currentUser.isAdmin){
      fetchAds();
    }
  }, [currentUser._id, currentUser?._id])

  const fetchAds = async () => {
    try {
      const res = await fetch(`api/ad/getads`)
      const data = await res.json();
      if(res.ok){
        setAds(data.ads);
        if(data.ads.length < 9){
          setShowMore(false);
        }
      }else{
        console.log('Failed to fetch ads');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteAd = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/ad/delete/${deleteAdID}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setAds((prev) =>
          prev.filter((ad) => ad._id !== deleteAdID)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowMore = async () => {
    const startIndex = ads.length;
    try {
      const res = await fetch(`api/ad/getads&startIndex=${startIndex}`)
      const data = await res.json();
      if(res.ok){
        setAds((prev) => [...prev, ...data.ads]);
        if(data.ads.length < 9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && ads.length > 0 ? (
        <div id="ads">
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Active</Table.HeadCell>
              <Table.HeadCell>Start - End</Table.HeadCell>
              <Table.HeadCell>Veiw Count</Table.HeadCell>
              <Table.HeadCell>Ad Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
            </Table.Head>
            <TableBody className="divide-y">
              {ads.map((ad, index) => (
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={index}>
                    <Table.Cell>
                        <span className="text-lg" >
                            {ad.isActive ? (
                                <HiOutlineCheck className="text-green-500"/>
                            ) : (
                                <HiOutlineX className="text-red-500"/>
                            )}
                        </span>
                    </Table.Cell>
                    <Table.Cell className="text-xs">
                      {(new Date(ad.startDate).toLocaleDateString()) + ' - ' + (new Date(ad.endDate).toLocaleDateString())}
                    </Table.Cell>
                    <Table.Cell className="">
                      {ad.viewCount}
                    </Table.Cell>
                    <Table.Cell>
                        <Link to={ad.targetURL} target="blank">
                        <img
                          src={ad.image}
                          alt={ad.title}
                          className="w-20 h-10 object-cover"
                          />
                        </Link>
                        
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    <Link to={ad.targetURL} target="blank">
                        {ad.title}
                    </Link>
                    </Table.Cell>
                    <Table.Cell className="text-xs">
                        {ad.content}
                    </Table.Cell>
                    <Table.Cell>
                      {ad.category}
                    </Table.Cell>
                    <Table.Cell className="max-w-10">
                      <span
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                        onClick={() => {
                          setShowModal(true)
                          setDeleteAdID(ad._id)
                        }}
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell className="max-w-10">
                      <Link to={`/update-ad/${ad._id}`}>
                        <span className='text-teal-500 hover:underline'>
                          Edit
                        </span>
                      </Link>
                    </Table.Cell>
                </Table.Row>
              ))}
            </TableBody>
          </Table>
          {showMore &&
            <Button onClick={handleShowMore} className="w-full self-center py-7 text-sm text-hl-purple">
              Show More
            </Button>
          }
        </div>
      ) : (
        <p>You have no ads yet.</p>
      )}

      <Modal
        show={showModal} onClose={() =>
        setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center mb-8">
            <HiOutlineExclamationCircle className='mx-auto mb-3 w-8 h-8 text-red-400' />
            <span className='inline-block font-medium text-gray-600'>
              Are you sure you want to delete this ad?
            </span>
          </div>
          <div className="flex flex-row justify-center gap-4">
            <Button
              color={'failure'}
              onClick={handleDeleteAd}
            >
              Yes, I'm sure
            </Button>
            <Button
              color='gray'
              onClick={() => setShowModal(false)}
            >
              No, Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}