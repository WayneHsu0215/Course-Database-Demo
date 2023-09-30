/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from "prop-types";
import {Icon} from "@iconify/react";
import {Link} from "react-router-dom";
import {logout} from "./logout.jsx";
const Layout = ({ children }) => {
    return (
        <div className="flex bg-gray-100 flex-col h-screen">
            <h1 className=" mt-12 mx-24 flex text-4xl  w-full font-semibold mb-4"><Icon className="text-4xl text-gray-500 text-3xl" icon="teenyicons:android-solid" />北護銀行助手-交易紀錄編輯器</h1>

            <nav className="w-full mx-auto flex justify-center  bg-gray-100 p-2">
                <Link to="/TranList" className="mx-4">帳號設置</Link>
                <Link to="/ntunhssu" className="mx-4">學生填寫資料管理</Link>
                <button onClick={logout} className="mx-4">登出</button>
            </nav>

            <main className="bg-gray-100 flex-grow">{children}</main>

            <footer className="text-center p-2 bg-gray-100">製作人:許朝威 電話:0966550373</footer>
        </div>
    );
};

export default Layout;
Layout.propTypes = {
    children: PropTypes.node.isRequired,
};