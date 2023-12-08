/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';
import {AuthContext} from './AuthContext';
import Modal from './Modal.jsx';
import {Icon} from '@iconify/react';
import {checkLoginStatus} from './checkLogin.jsx';

function TransList() {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const {loggedIn, updateLoggedInStatus} = useContext(AuthContext);  // 使用 updateLoggedInStatus 而不是 setLoggedIn
    const [transData, setTransData] = useState([]);
    const [searchTranID, setSearchTranID] = useState('');
    const [searchedTrans, setSearchedTrans] = useState(Rnull);

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/check-auth');
            const data = await response.json();
            if (data.success) {
                updateLoggedInStatus(true);  // 更新 AuthContext 的 loggedIn 狀態
            } else {
                updateLoggedInStatus(false);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            updateLoggedInStatus(false);
        }
    };

    const fetchTransData = () => {
        fetch('/api/trans')
            .then((response) => response.json())
            .then((data) => setTransData(data))
            .catch((error) => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        fetchTransData();
    }, []);

    const [newTrans, setNewTrans] = useState({
        AccID: '',
        AtmID: '',
        TranType: '',
        TranNote: '',
        UP_USR: '',
    });


    const addTransaction = (newTrans) => {
        fetch('/api/trans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTrans),
        })
            .then((response) => response.json())
            .then((data) => {
                fetchTransData();  // 重新載入資料
                setShowAlert(true);
            })
            .catch((error) => console.error('Error adding new transaction:', error));
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const deleteTransaction = (tranID) => {
        fetch(`/api/trans/${tranID}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                fetchTransData();  // 重新載入資料
                setShowDeleteAlert(true);
            })
            .catch((error) => console.error('Error deleting transaction:', error));
        setTimeout(() => {
            setShowDeleteAlert(false);
        }, 3000);
    };


    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedTrans, setEditedTrans] = useState(null);

    const openEditModal = (trans) => {
        setEditedTrans(trans);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditedTrans(null);
        setEditModalOpen(false);
    };


    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/trans/${editedTrans.TranID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedTrans),
            });

            if (response.ok) {
                // 更新成功，關閉編輯視窗並重新載入交易數據
                closeEditModal();
                fetchTransData();

                if (searchedTrans) {
                    fetch(`/api/trans/${searchedTrans.TranID}`)
                        .then((response) => response.json())
                        .then((data) => setSearchedTrans(data))
                        .catch((error) => console.error('Error fetching searched data:', error));
                }
            } else {
                // 更新失敗，可以顯示錯誤信息
                console.error('Update failed');
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };
    const searchTransaction = () => {
        if (!searchTranID) {
            return;
        }

        fetch(`/api/trans/${searchTranID}`)
            .then((response) => response.json())
            .then((data) => setSearchedTrans(data))
            .catch((error) => console.error('Error searching transaction:', error));
    };


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {!loggedIn ? (
                <p className="text-center text-red-600 text-4xl">請先登入方可使用所有功能謝謝</p>
            ) : (
                <div className="container m-4 rounded-lg border-4 border-gray-500 bg-gray-200 mx-auto  p-4">
                    <h1 className="m-4 font-bold text-2xl">交易紀錄crud</h1>
                    <form className="flex flex-col md:flex-row justify-center items-center w-full md:w-2/3 mx-auto"
                          onSubmit={(e) => {
                              e.preventDefault();
                              addTransaction(newTrans);
                          }}>


                        <table className=" w-full  border-gray-500 bg-white border-2">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border">銀行帳號</th>
                                <th className="py-2 px-4 border">ATM編號</th>
                                <th className="py-2 px-4 border">交易類型</th>
                                <th className="py-2 px-4 border">交易說明</th>
                                <th className="py-2 px-4 border">操作者</th>
                                <th className="py-2 px-4 border"/>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="py-2 px-4 border">
                                    <input type="text" placeholder="銀行帳號" value={newTrans.AccID}
                                           onChange={(e) => setNewTrans({...newTrans, AccID: e.target.value})}/>
                                </td>
                                <td className="py-2 px-4 border">
                                    <input type="text" placeholder="ATM編號" value={newTrans.AtmID}
                                           onChange={(e) => setNewTrans({...newTrans, AtmID: e.target.value})}/>
                                </td>
                                <td className="py-2 px-4 border">
                                    <input type="text" placeholder="交易類型" value={newTrans.TranType}
                                           onChange={(e) => setNewTrans({...newTrans, TranType: e.target.value})}/>
                                </td>
                                <td className="py-2 px-4 border">
                                    <input type="text" placeholder="交易說明" value={newTrans.TranNote}
                                           onChange={(e) => setNewTrans({...newTrans, TranNote: e.target.value})}/>
                                </td>
                                <td className="py-2 px-4 border">
                                    <input type="text" placeholder="操作者" value={newTrans.UP_USR}
                                           onChange={(e) => setNewTrans({...newTrans, UP_USR: e.target.value})}/>
                                </td>
                                <td>
                                    <button
                                        className=" px-4 h-8 rounded-lg  text-xl font-bold  text-white bg-green-500 hover:bg-green-700"
                                        type="submit">+
                                    </button>
                                    {showAlert && (
                                        <div
                                            className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow animate-slide-in-out"
                                        >
                                            交易建立成功！
                                        </div>
                                    )}

                                </td>
                            </tr>

                            </tbody>
                        </table>

                    </form>
                    <div className="flex flex-col md:flex-row justify-center items-center">
                        <input
                            className="border-2 bg-white text-center m-2 bg-gray-200 rounded-lg border-gray-300"
                            type="text"
                            placeholder="輸入交易編號"
                            value={searchTranID}
                            onChange={(e) => setSearchTranID(e.target.value)}
                        />
                        <button
                            className=" px-4 h-8 rounded-lg m-2   text-xl font-bold  text-white bg-green-500 hover:bg-green-700"
                            onClick={searchTransaction}>查詢
                        </button>
                    </div>
                    <div className="mb-4">
                        <button
                            className=" px-4 h-8 rounded-lg  text-xl font-bold  text-white bg-green-500 hover:bg-green-700"
                            onClick={() => setSearchedTrans(null)}>顯示全部
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-4 border-gray-500">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border">銀行帳號</th>
                                <th className="py-2 px-4 border">交易序號</th>
                                <th className="py-2 px-4 border">交易時間</th>
                                <th className="py-2 px-4 border">ATM編號</th>
                                <th className="py-2 px-4 border">交易類型</th>
                                <th className="py-2 px-4 border">交易說明</th>
                                <th className="py-2 px-4 border">操作者</th>
                                <th className="py-2 px-4 border">更新時間</th>
                            </tr>
                            </thead>
                            <tbody>
                            {searchedTrans ? ( // 如果有查詢結果
                                <tr>
                                    <td className="py-2 px-4 border">{searchedTrans.AccID}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.TranID}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.TranTime}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.AtmID}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.TranType}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.TranNote}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.UP_USR}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.UP_DATETIME}</td>
                                    <td className="py-2 px-4 flex justify-center border">
                                        <button
                                            className=" px-4 h-8 mr-4 rounded-lg  text-xl font-bold  text-white bg-green-500 hover:bg-green-700"
                                            onClick={() => deleteTransaction(searchedTrans.TranID)}>刪除
                                        </button>

                                        <button
                                            className=" px-4 h-8 rounded-lg  text-xl font-bold  text-white bg-green-500 hover:bg-green-700"
                                            onClick={() => openEditModal(searchedTrans)}>編輯
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                transData.map((trans, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                        <td className="py-2 px-4 border">{trans.AccID}</td>
                                        <td className="py-2 px-4 border">{trans.TranID}</td>
                                        <td className="py-2 px-4 border">{trans.TranTime}</td>
                                        <td className="py-2 px-4 border">{trans.AtmID}</td>
                                        <td className="py-2 px-4 border">{trans.TranType}</td>
                                        <td className="py-2 px-4 border">{trans.TranNote}</td>
                                        <td className="py-2 px-4 border">{trans.UP_USR}</td>
                                        <td className="py-2 px-4 border">{trans.UP_DATETIME}</td>
                                        <td className="py-2 px-4 flex justify-center border">
                                            <button
                                                className=" px-4 mr-4 h-8 rounded-lg  text-xl font-bold  text-white bg-green-500 hover:bg-green-700"
                                                onClick={() => deleteTransaction(trans.TranID)}>刪除
                                            </button>
                                            {showDeleteAlert && (
                                                <div
                                                    className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded shadow animate-slide-in-out"
                                                >
                                                    刪除成功!
                                                </div>
                                            )}
                                            <button
                                                className=" px-4 h-8 rounded-lg  text-xl font-bold  text-white bg-green-500 hover:bg-green-700"
                                                onClick={() => openEditModal(trans)}>編輯
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                    {editedTrans && (
                        <Modal  isOpen={editModalOpen} onClose={closeEditModal}>

                            <form onSubmit={handleEditSubmit}>
                                <tbody>
                                <tr>
                                    <th className="py-2 px-4 border">銀行帳號</th>
                                    <th className="py-2 px-4 border">ATM編號</th>
                                    <th className="py-2 px-4 border">交易類型</th>
                                    <th className="py-2 px-4 border">交易說明</th>
                                    <th className="py-2 px-4 border">操作者</th>
                                </tr>
                                </tbody>
                                <td><input type="text" placeholder="銀行帳號" value={editedTrans.AccID}
                                           onChange={(e) => setEditedTrans({...editedTrans, AccID: e.target.value})}/>
                                </td>
                                <td><input type="text" placeholder="ATM編號" value={editedTrans.AtmID}
                                           onChange={(e) => setEditedTrans({...editedTrans, AtmID: e.target.value})}/>
                                </td>
                                <td><input type="text" placeholder="交易類型" value={editedTrans.TranType}
                                           onChange={(e) => setEditedTrans({
                                               ...editedTrans,
                                               TranType: e.target.value
                                           })}/>
                                </td>
                                <td><input type="text" placeholder="交易說明" value={editedTrans.TranNote}
                                           onChange={(e) => setEditedTrans({
                                               ...editedTrans,
                                               TranNote: e.target.value
                                           })}/>
                                </td>
                                <td><input type="text" placeholder="操作者" value={editedTrans.UP_USR}
                                           onChange={(e) => setEditedTrans({...editedTrans, UP_USR: e.target.value})}/>
                                </td>

                                <button
                                    className=" px-4 h-8 rounded-lg  text-xl font-bold  text-white bg-green-500 hover:bg-green-700"
                                    type="submit">更新交易
                                </button>

                            </form>
                        </Modal>
                    )}

                </div>
            )}
            <style>
                {`
                @keyframes slide-in-out {
                    0%, 100% { transform: translateX(120%); }
                    10%, 90% { transform: translateX(0); }
                }

                .animate-slide-in-out {
                    animation: slide-in-out 3s ease;
                }
                `}
            </style>
        </div>


    );


}

export default TransList;


