import {Helmet} from 'react-helmet';
import React, {useState} from 'react';
import {Icon} from '@iconify/react';
import Modal from "./Modal.jsx";

const Ntunhssu = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ismOpen, setIsmOpen] = useState(false);
    const SESSIONS = Object.freeze({
        1: {name: '1', time: ['08:10', '09:00']},
        2: {name: '2', time: ['09:10', '10:00']},
        3: {name: '3', time: ['10:10', '11:00']},
        4: {name: '4', time: ['11:10', '12:00']},
        5: {name: '5', time: ['12:40', '13:30']},
        6: {name: '6', time: ['13:40', '14:30']},
        7: {name: '7', time: ['14:40', '15:30']},
        8: {name: '8', time: ['15:40', '16:30']},
        9: {name: '9', time: ['16:40', '17:30']},
        A: {name: '10', time: ['17:40', '18:30']},
        B: {name: '11', time: ['18:35', '19:25']},
        C: {name: '12', time: ['19:30', '20:20']},
        D: {name: '13', time: ['20:25', '21:15']},
        E: {name: '14', time: ['21:20', '22:10']},
    });
    const weekdays = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

    const grades = ['1年級', '2年級', '3年級', '4年級', '5年級', '6年級', '7年級'];

    const courseCategories = [
        '跨校', '跨域課程', '全英語授課', 'EMI全英語授課', '同步遠距教學',
        '非同步遠距教學', '混合式遠距教學', '遠距教學課程', '遠距輔助課程'
    ];

    const systems = ['二技', '二技(三年)', '四技', '學士後多元專長', '碩士班', '博士班', '學士後學位學程', '學士後系'];


    const [isOpen, setIsOpen] = useState({
        semester: false,
        system: false,
        departmentGradeType: false,
        weekday: false,
        period: false,
        courseCategory: false,
        teacherCourse: false
    });
    const toggleAllDropdowns = (value) => {
        setIsOpen(prevState => ({
            semester: value,
            system: value,
            departmentGradeType: value,
            weekday: value,
            period: value,
            courseCategory: value,
            teacherCourse: value
        }));
    }

    const toggleSection = (sectionName) => {
        setExpandedSections(prevState => ({
            ...prevState,
            [sectionName]: !prevState[sectionName]
        }));
    };


    const toggleDropdown = (section) => {
        setIsOpen(prevState => ({...prevState, [section]: !prevState[section]}));
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Helmet>
                <title>課程查詢系統</title>
            </Helmet>

            <div className="bg-white p-6 rounded shadow-md max-w-7xl mx-auto">
                <ul className="flex  border-b mb-3 ">
                    <li className="-mb-px mr-1">
                        <a className="bg-white  inline-block border-l border-t border-r rounded-t py-1 px-2 text-green-500 font-semibold"
                           href="/"><Icon className="inline mx-2 text-2xl " icon="line-md:cloud-print-outline-loop"/>課程查詢系統</a>
                    </li>
                    <li className="mr-1">
                        <a
                            className="bg-white inline-block py-1 px-2 text-green-500 hover:text-green-800 font-semibold"
                            href="https://system8.ntunhs.edu.tw/myNTUNHS_student/Modules/Main/Index_student.aspx?first=true"
                            target="_blank"
                            rel="noopener noreferrer">e-protfolio 學習歷程<Icon className="inline mx-2 text-2xl "
                                                                                icon="line-md:person-search-twotone"/>
                        </a>
                    </li>
                    <li className="mr-1">
                        <a
                            className="bg-white inline-block py-1 px-2 text-green-500 hover:text-green-800 font-semibold"
                            href="https://system16.ntunhs.edu.tw/myNTUNHS_coc/Modules/Main/Index_COC.aspx"
                            target="_blank"
                            rel="noopener noreferrer">選課系統</a>
                    </li>
                </ul>
                <div className="flex">
                    <h1 className="text-2xl font-bold mb-4">國立臺北護理健康大學 課程查詢系統<Icon
                        className="inline mx-2 text-2xl " icon="line-md:text-box"/></h1>

                    <button type="button"
                            onClick={() => setIsModalOpen(true)}
                        className="ml-auto  hover:bg-red-500/50  border w-32 p-2 rounded-lg font-bold bg-red-300/50 text-gray-700  border-red-600/50 border-2 items-center"><Icon
                        className="inline mx-2 text-2xl " icon="line-md:question-circle"/>注意事項</button>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-4">注意事項<Icon
                            className="inline mx-2 text-2xl " icon="svg-spinners:blocks-shuffle-3"/></h1>

                        <div>

                            <p className="text-lg text-red-600 font-bold mb-4">※本查詢執行速度比舊的快，別用舊系統了 。</p>
                            <p className="text-lg font-bold mb-4">※所有欄位皆提供模糊查詢，請安心使用。</p>
                            <p className="text-lg font-bold mb-4">※選課日程及注意事項等請詳閱教務處網站選課公告</p>
                            <p className="text-lg font-bold mb-4 flex justify-center">【學校首頁→教務處→選課專區】</p>
                        </div>
                    </div>
                </Modal>
                <form className="space-y-4">


                    <div className="w-2/5">
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">學期：</label>
                        <select id="semester" className="mt-1 block w-full py-2 px-3 border rounded-md">
                            <option value="112上">112學年度上學期</option>
                            <option value="111下">111學年度下學期</option>
                        </select>
                    </div>

                    <div className="flex h-0.5 justify-center items-start text-xs text-gray-400">
                        <button
                            className="mx-8"
                            type="button"
                            onClick={() => toggleAllDropdowns(true)}>  {/* 打開所有下拉框 */}
                            展開全部{"<>"}
                        </button>

                        <button
                            className="mx-8"
                            type="button"
                            onClick={() => toggleAllDropdowns(false)}> {/* 關閉所有下拉框 */}
                            收起全部{"><"}
                        </button>
                    </div>
                    <div className="flex justify-center w-full">
                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.departmentGradeType ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('departmentGradeType')}>
                            系所/年級/課別 {isOpen.departmentGradeType ?
                            <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop"/> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop"/>}
                        </button>
                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.weekday ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('weekday')}>
                            星期 {isOpen.weekday ? <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop"/> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop"/>}
                        </button>
                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.system ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('system')}>
                            學制 {isOpen.system ? <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop"/> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop"/>}
                        </button>
                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.period ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('period')}>
                            節次 {isOpen.period ? <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop"/> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop"/>}
                        </button>

                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.courseCategory ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('courseCategory')}>
                            課程內容分類 {isOpen.courseCategory ?
                            <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop"/> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop"/>}
                        </button>

                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.teacherCourse ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('teacherCourse')}>
                            教師/課程 {isOpen.teacherCourse ?
                            <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop"/> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop"/>}
                        </button>
                    </div>
                    <div>

                        {isOpen.system && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">學制：</label>

                                <div className="border rounded-l p-4 grid grid-cols-4 gap-4">

                                    {systems.map(system => (
                                        <label key={system} className="inline-flex items-center">
                                            <input type="radio" className="form-radio" name="system" value={system}/>
                                            <span className="ml-2">{system}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>

                        <div className="flex justify-between w-full">

                            {isOpen.departmentGradeType && (

                                <div className="w-full flex  justify-between ">

                                    <div className="w-3/4 ">
                                        <label htmlFor="department"
                                               className="block  text-sm font-medium text-gray-700">系所：</label>
                                        <select id="department"
                                                className=" mt-1 block w-full py-2 px-3 border rounded-md">
                                            <option value="護理系">護理系</option>
                                            <option value="高齡健康照護系">高齡健康照護系</option>
                                        </select>
                                    </div>

                                    <div className="w-3/4 mx-4">
                                        <label htmlFor="grade"
                                               className="block text-sm font-medium text-gray-700">年級：</label>
                                        <select id="grade" className="mt-1 block w-full py-2 px-3 border rounded-md">
                                            {grades.map((grade, index) => (
                                                <option key={index} value={index + 1}>{grade}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-3/4 mx-4">
                                        <label htmlFor="courseType"
                                               className="block text-sm font-medium text-gray-700">課別：</label>
                                        <select id="courseType"
                                                className="mt-1 block w-full py-2 px-3 border rounded-md">
                                            <option value="通識必修">通識必修(通識)</option>
                                            <option value="通識選修">通識選修(通識)</option>
                                            <option value="專業必修">專業必修(系所)</option>
                                            <option value="專業選修">專業選修(系所)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                    <div>

                        {isOpen.weekday && (
                            <div className="">
                                <label htmlFor="grade"
                                       className="block text-sm font-medium text-gray-700">星期：</label>
                                <div className=" border rounded-l p-4 mt-2 space-y-2">
                                    {weekdays.map(day => (
                                        <label key={day} className="mx-4 inline-flex items-center">
                                            <input type="checkbox" className="form-checkbox" name="weekday"
                                                   value={day}/>
                                            <span className="mx-1">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div>

                        {isOpen.period && (
                            <div className="flex flex-col items-start w-full">
                                <label className="block text-sm font-medium text-gray-700">節次：</label>
                                <div className="border rounded-l p-4 grid grid-cols-4 gap-4 w-full">
                                    {Object.entries(SESSIONS).map(([key, session]) => (
                                        <label key={key} className="flex items-center space-x-2">
                                            <input type="checkbox" className="form-checkbox" name="period"
                                                   value={`節${session.name}`}/>
                                            <span>{`第${session.name}節(${session.time[0]}~${session.time[1]})`}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        {isOpen.courseCategory && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">課程內容分類：</label>
                                <div className="border rounded-l p-4 grid grid-cols-3 gap-4">
                                    {courseCategories.map(category => (
                                        <label key={category} className="inline-flex items-center">
                                            <input type="checkbox" className="form-checkbox" name="courseCategory"
                                                   value={category}/>
                                            <span className="ml-2">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        {isOpen.teacherCourse && (
                            <div className="flex space-x-4 border rounded-l p-4">

                                <div className="flex-1">
                                    <label htmlFor="teacher"
                                           className="block text-sm font-medium text-gray-700">教師：</label>
                                    <input type="text" id="teacher"
                                           className="mt-1 block w-full py-2 px-3 border rounded-md"
                                           placeholder="教師代碼"/>
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="course"
                                           className="block text-sm font-medium text-gray-700">課程：</label>
                                    <input type="text" id="course"
                                           className="mt-1 block w-full py-2 px-3 border rounded-md"
                                           placeholder="課程代碼"/>
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="class"
                                           className="block text-sm font-medium text-gray-700">班級：</label>
                                    <input type="text" id="class"
                                           className="mt-1 block w-full py-2 px-3 border rounded-md"
                                           placeholder="班級名稱"/>
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="classroom"
                                           className="block text-sm font-medium text-gray-700">教室：</label>
                                    <input type="text" id="classroom"
                                           className="mt-1 block w-full py-2 px-3 border rounded-md"
                                           placeholder="教室代號"/>
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="number"
                                           className="block text-sm font-medium text-gray-700">人數：</label>
                                    <select id="number" className="mt-1 block w-full py-2 px-3 border rounded-md">
                                        <option value="=">=</option>

                                        <option value="<">{"<"}</option>
                                        <option value=">">{">"}</option>
                                        <option value="<">{"<="}</option>

                                        <option value=">=">{">="}</option>

                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <button type="button"
                                onClick={() => setIsmOpen(true)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"><Icon
                            className="inline text-2xl mx-1" icon="line-md:search-filled"/>查詢
                        </button>
                        <Modal
                            isOpen={ismOpen}
                            onClose={() => setIsmOpen(false)}
                        >
                            <table className="text-sm min-w-full bg-white border border-gray-300 rounded-lg divide-y divide-gray-300 table-auto">
                                <thead>
                                <tr>
                                    <th className="py-1 px-2 border-b border-gray-300">編號</th>
                                    <th className="py-1 px-2 border-b border-gray-300">學期</th>
                                    <th className="py-1 px-2 border-b border-gray-300">系所</th>
                                    <th className="py-1 px-2 border-b border-gray-300">年級</th>
                                    <th className="py-1 px-2 border-b border-gray-300">班組</th>
                                    <th className="py-1 px-2 border-b border-gray-300">科目代號</th>
                                    <th className="py-1 px-2 border-b border-gray-300">課程名稱</th>
                                    <th className="py-1 px-2 border-b border-gray-300">教師姓名</th>
                                    <th className="py-1 px-2 border-b border-gray-300">上課人數</th>
                                    <th className="py-1 px-2 border-b border-gray-300">學分數</th>
                                    <th className="py-1 px-2 border-b border-gray-300">課別</th>
                                    <th className="py-1 px-2 border-b border-gray-300">地點</th>
                                    <th className="py-1 px-2 border-b border-gray-300">星期</th>
                                    <th className="py-1 px-2 border-b border-gray-300">節次</th>
                                     </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="py-1 px-2">0001</td>
                                    <td className="py-1 px-2">1121</td>
                                    <td className="py-1 px-2">四年制資訊管理系</td>
                                    <td className="py-1 px-2">3</td>
                                    <td className="py-1 px-2">A0</td>
                                    <td className="py-1 px-2">0132</td>
                                    <td className="py-1 px-2">系統分析與設計</td>
                                    <td className="py-1 px-2">連中岳</td>
                                    <td className="py-1 px-2">38</td>
                                    <td className="py-1 px-2">3</td>
                                    <td className="py-1 px-2">專業必修(系所)</td>
                                    <td className="py-1 px-2">S104</td>
                                    <td className="py-1 px-2">5</td>
                                    <td className="py-1 px-2">5~7節</td>
                                </tr>
                                </tbody>
                            </table>
                        </Modal>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default Ntunhssu;
