import React, { useEffect, useRef, useState } from "react";
import { useAllState } from "../Provider";
import { Link, Outlet, useLocation } from "react-router-dom";

import Cookies from "universal-cookie";
import Loading from "./Loading";

export default function Dashboard() {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const showMenu = () => {
    setIsMenuOpened(true);
  };
  const hideMenu = () => {
    if (isMenuOpened) {
      setIsMenuOpened(false);
    }
  };

  const { setToken } = useAllState();
  const { setUserInfo } = useAllState();
  const { userInfo } = useAllState();

  const [myBlogs, setMyBlogs] = useState();
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();

  const parseISOString = (s) => {
    // return new Date(toString(s));
    // console.log(s);
    return s;
  };

  let location = useLocation();
  useEffect(() => {
    fetch(`http://localhost:4000/blog/my-blogs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth: `ut ${cookies.get("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.status);
        }
      })
      .then((result) => {
        setMyBlogs(result);
        setLoading(false);
      });
  }, []);

  const logout = () => {
    cookies.remove("token");
    setToken("");
    setUserInfo();
    window.location.href = "/";
  };

  return (
    <>
      <div className="w-full bg-white relative flex" onClick={hideMenu}>
        <div className="w-full h-full flex flex-col justify-between">
          <header className="h-16 w-full flex items-center justify-between relative  px-5 space-x-10 bg-[#EEEEEE]">
            <div>
              <Link to={"/"}>
                <img
                  src={require("../images/logopng.png")}
                  className="w-24"
                ></img>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to={"/user/dashboard"}
                className="flex flex-shrink-0 items-center space-x-4"
              >
                <div className="flex flex-col items-end ">
                  <div className="text-md font-medium ">{userInfo.name}</div>
                  <div className="text-sm font-regular"></div>
                </div>
                <img
                  src={userInfo.imgurl}
                  className="h-10 w-10 rounded-full border border-[#607027]"
                ></img>
              </Link>
              <div className="ml-3 cursor-pointer relative" onClick={showMenu}>
                <i class="fa fa-cog" aria-hidden="true"></i>
                <div
                  className={`w-[100px] h-[80px] absolute right-0 top-[34px] bg-white rounded-sm border text-sm ${
                    isMenuOpened ? "" : "hidden"
                  }`}
                >
                  <ul className="h-full">
                    <Link to={"/user/dashboard/edituser"}>
                      <li
                        className="h-1/2 flex items-center border-b hover:bg-gray-100 p-2 transition-colors"
                        onClick={hideMenu}
                      >
                        setting
                      </li>
                    </Link>

                    <li
                      className="h-1/2 flex items-center hover:bg-gray-100 p-2 transition-colors"
                      onClick={logout}
                    >
                      <p>log out</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          {location.pathname === "/user/dashboard" ? (
            <main className="max-w-full h-full flex flex-col px-2 pt-3 min-h-screen">
              <div className="h-full w-full flex flex-wrap justify-center mb-[55px]">
                {loading ? (
                  <Loading />
                ) : myBlogs.length === 0 ? (
                  <div>
                    <div>You have not created any posts</div>
                    <Link to={"/user/dashboard/createblog"}>Add</Link>
                  </div>
                ) : (
                  <section className="text-gray-600 body-font w-full">
                    <div className="container py-10 mx-auto">
                      <div className="mb-3 text-right">
                        <Link to={"/user/dashboard/createblog"} className='bg-[#607027] text-sm font-medium px-3 py-2 rounded text-white'>+ Add a New Blog</Link>
                      </div>
                      <div className="flex flex-wrap -m-4">
                        {myBlogs.map((item) => (
                          <div className="p-4 sm:w-full w-full dashboardCard">
                            <div className="h-full shadow rounded overflow-hidden">
                              <img
                                className="w-full h-60 object-cover object-center"
                                src={item.imgurl}
                                style={{ height: "15rem" }}
                                alt="blog"
                              />
                              <div className="py-3 px-4">
                                <h2 className="text-xs tracking-wide title-font font-medium text-gray-400 mb-1">
                                  {parseISOString(item.createdAt)}
                                </h2>
                                <h1 className="title-font text-lg font-medium text-gray-600 mb-1">
                                  {item.title}
                                </h1>
                                <p
                                  className="leading-relaxed mb-3 text-sm overflow-hidden truncate whitespace-nowrap"
                                  dangerouslySetInnerHTML={{
                                    __html: item.content,
                                  }}
                                ></p>
                                <div className="flex items-center justify-center flex-wrap ">
                                  <Link to={`/user/dashboard/editblog/${item._id}`}
                                    className="px-8 py-2 w-2/6 bg-[#607027] text-white transition-all duration-300 rounded"
                                    onClick={(e) => {
                                      // getPostForEdit(item._id);
                                      // setCurrentPostId(item._id);
                                    }}
                                  >
                                    Edit
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* {state.account ? (
                <div className="w-full p-4" id="editSection">
                  <EditUser userInfo={userInfo} />
                </div>
              ) : (
                ""
              )} */}
              </div>
            </main>
          ) : (
            ""
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
