import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import {
  useAddLogoMutation,
  useGetLogosQuery,
  useUpdateLogoMutation,
} from "../../../../Redux/logoApi";
import toast from "react-hot-toast";

export default function Logo() {
  const [images, setImages] = useState([]);

  const { data } = useGetLogosQuery();
  const logo = data?.data;
  const id = logo?._id;

  const [addLogo, { isLoading: addLoading }] = useAddLogoMutation();
  const [updateLogo, { isLoading: updateLoading }] = useUpdateLogoMutation();

  const handleAddBanner = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("logo", images[0]?.file);

    if (id) {
      const res = await updateLogo({ id, formData });
      if (res?.data?.success) {
        setImages([]);
        toast.success("Logo updated successfully");
      } else {
        toast.error(
          res?.data?.error ? res?.data?.error : "Something went wrong"
        );
      }
    } else {
      const res = await addLogo(formData);
      if (res?.data?.success) {
        setImages([]);
        toast.success("Logo added successfully");
      } else {
        toast.error(
          res?.data?.error ? res?.data?.error : "Something went wrong"
        );
      }
    }
  };

  return (
    <section className="bg-base-100 shadow rounded">
      <div className="p-4 border-b text-neutral font-medium flex justify-between items-center">
        <h3>Add Logo</h3>
      </div>

      <form onSubmit={handleAddBanner} className="p-4">
        <div className="md:w-1/2 w-full">
          <p className="mb-1">Logo</p>
          <div>
            <ImageUploading
              defaultValue={images}
              onChange={(icn) => setImages(icn)}
              dataURLKey="data_url"
            >
              {({ onImageUpload, onImageRemove, dragProps }) => (
                <div
                  className="border rounded border-dashed p-4 md:flex items-center gap-10"
                  {...dragProps}
                >
                  <div className="flex items-center gap-2">
                    <span
                      onClick={onImageUpload}
                      className="w-max px-4 py-1.5 rounded-2xl text-base-100 bg-primary cursor-pointer text-sm"
                    >
                      Choose Image
                    </span>

                    <p className="text-neutral-content">or Drop here</p>
                  </div>

                  <div className={`${images?.length > 0 && "mt-4"} `}>
                    {images?.map((img, index) => (
                      <div key={index} className="image-item relative">
                        <img
                          src={img["data_url"]}
                          alt="logo"
                          className="w-32 h-20"
                          loading="lazy"
                        />
                        <div
                          onClick={() => onImageRemove(index)}
                          className="w-7 h-7 bg-primary rounded-full flex justify-center items-center text-base-100 absolute top-0 right-0 cursor-pointer"
                        >
                          <AiFillDelete />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ImageUploading>
          </div>
        </div>
        <div className="mt-4">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${logo?.logo}`}
            alt="logo"
            className="w-32"
            loading="lazy"
          />
        </div>

        <div className="mt-5">
          <div className="flex gap-2">
            <button disabled={addLoading && "disabled"} className="primary_btn">
              {addLoading || updateLoading
                ? "Loading..."
                : logo?._id
                ? "Update Logo"
                : "Add Logo"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
