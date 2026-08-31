"use client";

import ProfileImagePreviewModal from "./profile-image-preview.modal";
import BottomHeader from "./bottom";
import TopHeader from "./top";

const Header: React.FC<{ show: boolean }> = ({ show }) => {

  if (!show) return null;

  return (
    <>
      <TopHeader />

      <BottomHeader />

      {/* <SubHeaderSlider /> */}

      {/* Profile Image Preview Modal */}
      <ProfileImagePreviewModal />
    </>
  );
};

export default Header;
