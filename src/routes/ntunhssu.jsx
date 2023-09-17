
import { Helmet } from 'react-helmet';
import React, { useState } from 'react';
import PizZip from 'pizzip'; // 注意這一行
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';

const Ntunhssu = () => {
    const [name, setName] = useState('');

    const generateWord = async () => {
        const content = await fetch('http://localhost:3251/documents/B12.docx')
            .then((r) => r.blob())
            .then((blob) => blob.arrayBuffer())
            .then((arrayBuffer) => new PizZip(arrayBuffer));

        const doc = new Docxtemplater(content, {
            zip: content,
        });

        doc.setData({
            name: name,
        });

        doc.render();

        const buffer = doc.getZip().generate({ type: 'blob' }); // 修改這裡為 blob

        saveAs(buffer, 'B12.docx');
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Helmet>
                <title>碩士報名表測試</title>
            </Helmet>
            <header className="bg-blue-500/40 text-black/50 font-bold text-center p-4">
                <h1 className="text-2xl">碩士測試</h1>
            </header>
            <div className="App">
                <input
                    type="text"
                    placeholder="請輸入您的名字"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={generateWord}>生成 Word 文件</button>
            </div>
        </div>
    );
};

export default Ntunhssu;
