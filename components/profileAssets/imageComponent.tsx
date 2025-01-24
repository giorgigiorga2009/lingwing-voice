import Swal from 'sweetalert2';
import Cropper, { Area, Point } from 'react-easy-crop';
import style from './image.module.scss';
import { useSession } from 'next-auth/react';
import { UploadImage } from '@utils/profileEdit';
import { useTranslation } from '@utils/useTranslation';
import React, { useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';

type Prop = {
  CroppedImage: (image: string) => void;
  defaultImage?: string;
};

export default function ImageComponent({ CroppedImage, defaultImage }: Prop) {
  const { data: session } = useSession();
  const [image, setImage] = useState<string>('');
  const [crop, setCrop] = useState<Area>({ x: 0, y: 0, width: 1, height: 1 });
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [showCroppedImage, setShowCroppedImage] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [imageLink, setImageLink] = useState<string>('');

  const cropperRef = useRef<any>(null);

  const { t } = useTranslation();

  const handleCropComplete = async (
    _croppedArea: Area,
    croppedAreaPixels: Area
  ) => {
    try {
      const croppedImage = await getCroppedImage(image, croppedAreaPixels);
      setCroppedImage(croppedImage);
      setShowCroppedImage(true);
      CroppedImage(imageLink);
    } catch (error) {
      console.error(error);
    }
  };


  const getCroppedImage = async (imageSrc: string, crop: Area) => {
    return new Promise<string>((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const scaleX = image.naturalWidth / image.width;
          const scaleY = image.naturalHeight / image.height;

          canvas.width = crop.width;
          canvas.height = crop.height;

          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
          );

          const croppedImageUrl = canvas.toDataURL('image/jpeg');
          resolve(croppedImageUrl);
        }
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);
        setCroppedImage('');
        setShowCroppedImage(false);
        setShowCropper(false);
      };
    }
  };

  const handleCropChange = (location: Point) => {
    setCrop((prevCrop) => ({
      ...prevCrop,
      ...location,
    }));
  };

  const handleZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleSave = () => {
    setShowCroppedImage(false);
    setShowCropper(true);
  };

  const handleClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    handleSave();

    if (session && e.currentTarget && e.currentTarget.value) {
      if (e.currentTarget.value === t('APP_PROFILE_UPLOAD_IMAGE')) {
        try {
          const res = await UploadImage(session.user.accessToken, croppedImage);
          setImageLink(res.data);
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Failed to upload image',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonColor: 'rgb(105 46 150)',
            confirmButtonText: 'OK',
            customClass: {
              popup: style.swalPopup
            }
          });
          console.error('UploadImage error:', error);
        }
      }
    } else {
      e.preventDefault();
    }
  };

  // Using useEffect to respond to changes in showCroppedImage
  useEffect(() => {
    // console.log(showCroppedImage, "State updated!");
  }, [showCroppedImage]);
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const zoomFactor = 0.1; // Adjust the zoom factor as needed
    const deltaY = e.deltaY;

    if (deltaY < 0) {
      setZoom((prevZoom) => Math.min(prevZoom + zoomFactor, 3));
    } else if (deltaY > 0) {
      setZoom((prevZoom) => Math.max(prevZoom - zoomFactor, 1));
    }
  };

  
  return (
    <div className={style.container}>
      <div className={style.Image}>
        {croppedImage || defaultImage ? (
          <NextImage
            src={croppedImage || (defaultImage ? defaultImage : '')}
            alt="User avatar"
            height={200}
            width={200}
          />
        ) : (
          <>
            <label htmlFor="upload">{t('APP_PROFILE_UPLOAD_IMAGE')}</label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      {!showCroppedImage && (
        <>
          <label htmlFor="upload" className={style.btn}>
            {t('APP_PROFILE_CHANGE_IMAGE')}
          </label>
          <input
            id="upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </>
      )}

      {image && !showCropper && (
        <>
          <div
            className={`${style.resizableBox} ${style.cropperWrapper}`}
            onWheel={handleWheel}
          >
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={handleCropChange}
              onCropComplete={handleCropComplete}
              onZoomChange={handleZoomChange}
              minZoom={1}
              maxZoom={3}
              ref={cropperRef}
            />
          </div>
          <strong>scroll for zoom</strong>
        </>
      )}
      {image && showCroppedImage && (
        <input
          type="button"
          value={t('APP_PROFILE_UPLOAD_IMAGE')}
          className={style.btn}
          onClick={handleClick}
        />
      )}
    </div>
  );
}
