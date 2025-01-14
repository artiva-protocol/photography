import React, { Fragment, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HomeProps } from "@artiva/shared";
import GlobalProvider from "../context/GlobalProvider";
import Footer from "../components/Footer";
import useCustomProperties from "../hooks/useCustomProperties";
import { Bars3Icon } from "@heroicons/react/24/solid";
import MobileNavigation from "../components/MobileNavigation";
const PostPreview = dynamic(() => import("../post/PostPreview"), {
  ssr: false,
});

const Home = ({ ctx, platform }: HomeProps) => {
  const { Nav, ConnectButton, CustomConnectButton, Image } = ctx.components;
  const { useInfinitePosts } = ctx.hooks;
  const custom = useCustomProperties({ platform });
  const [navOpen, setNavOpen] = useState(false);

  const headerStyles = () => {
    switch (custom.header_style) {
      case "Center aligned":
        return "items-center justify-around";
      case "Left aligned":
        return "items-end justify-left";
      case "Hidden":
        return "hidden";
    }
  };

  const { data, loaderElementRef } = useInfinitePosts({
    platform: platform.id,
    limit: 21,
  });

  const posts = data?.flat();

  const showingHeader = custom.header_style !== "Hidden";
  const showingCover = custom.show_platform_cover && platform.cover_image;

  return (
    <GlobalProvider ctx={ctx} platform={platform}>
      {navOpen && (
        <MobileNavigation
          navigation={platform.navigation}
          onClose={() => setNavOpen(false)}
        />
      )}
      <div className="pb-20 bg-white dark:bg-black">
        <div
          className={`relative ${
            showingCover ? "h-[80vh]" : showingHeader ? "h-auto" : "h-20"
          }`}
        >
          <div className="absolute z-30 top-0 py-8 px-10 flex items-center justify-between w-full">
            <div className="flex items-baseline">
              {custom.show_logo_in_navigation && (
                <Fragment>
                  {platform?.logo ? (
                    <Image
                      alt="logo"
                      className="w-full h-8 mr-10 cursor-pointer object-scale-down"
                      src={platform?.logo}
                      width={300}
                      height={300}
                    />
                  ) : (
                    <h1
                      className={`${
                        showingCover
                          ? "text-white"
                          : "text-black dark:text-white"
                      } text-2xl mr-10 font-semibold`}
                    >
                      {platform?.title}
                    </h1>
                  )}
                </Fragment>
              )}
              <div className="hidden sm:block">
                {platform?.navigation && (
                  <Nav
                    className={`${
                      showingCover
                        ? "text-gray-800"
                        : "text-gray-800 dark:text-white"
                    } text-lg mr-10`}
                    navigation={platform?.navigation.filter(
                      (x) => !x.secondary
                    )}
                  />
                )}
              </div>
            </div>
            <div className="text-center hidden sm:block">
              {ConnectButton && (
                <ConnectButton>
                  {(props: any) => (
                    <CustomConnectButton
                      {...props}
                      connectWalletText={custom.connect_wallet_text}
                      forceChain={false}
                      className={`${
                        showingCover
                          ? "text-white border-white"
                          : "text-black border-black dark:text-white dark:border-white"
                      } border w-40 h-8 rounded-md`}
                    />
                  )}
                </ConnectButton>
              )}
            </div>
            <button
              onClick={() => setNavOpen(true)}
              className="sm:hidden focus:outline-none"
            >
              <Bars3Icon className="h-8 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <Fragment>
            <div
              className={`z-20 text-white p-6 px-10  ${
                showingCover ? "h-full" : "h-auto min-h-[50vh]"
              } w-full flex ${headerStyles()}`}
            >
              <div
                className={`z-20 ${
                  custom.header_style === "Left aligned"
                    ? "text-left"
                    : "text-center px-4 sm:px-20 py-20 flex flex-col items-center"
                }`}
              >
                {!custom.show_logo_in_navigation && (
                  <Fragment>
                    {platform?.logo ? (
                      <Image
                        alt="logo"
                        className="w-full max-w-md h-28 object-scale-down z-20"
                        src={platform?.logo}
                        width={600}
                        height={600}
                      />
                    ) : (
                      <h1
                        className={`${
                          showingCover
                            ? "text-white"
                            : "text-black dark:text-white"
                        } text-5xl font-semibold z-20`}
                      >
                        {platform?.title}
                      </h1>
                    )}
                  </Fragment>
                )}
                <h2
                  className={`${
                    showingCover ? "text-white" : "text-black dark:text-white"
                  } z-20 text-md sm:text-2xl font-extralight mt-6`}
                >
                  {platform?.description}
                </h2>
              </div>
            </div>
            {showingCover && (
              <Image
                src={platform?.cover_image!}
                alt="cover"
                className="object-cover w-full absolute top-0 left-0 h-full z-10"
                width={2000}
                height={2000}
              />
            )}
          </Fragment>
        </div>
        <div className="columns-1 md:columns-2 2xl:columns-3 gap-4 space-y-4 p-8">
          {posts?.map((x: any) => (
            <div className="h-min w-full">
              <PostPreview post={x} />
            </div>
          ))}
        </div>
        <div ref={loaderElementRef} />
        <Footer platform={platform} />
      </div>
    </GlobalProvider>
  );
};

const Header = () => {};

export default Home;
