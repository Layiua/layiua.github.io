import { useState } from 'react';
import { BsClipboard, BsClipboardCheck } from 'react-icons/bs';
import ModalTemplate from '../../ModalTemplate';

function ModalInfo({ user }) {
    const [copied, setCopied] = useState(false);
    const { photoURL, displayName, email, phoneNumber, uid } = user;

    const handleCopyId = () => {
        navigator.clipboard.writeText(uid);
        setCopied(true);
    };

    return (
        <ModalTemplate>
            <div className='md:flex-center gap-5'>
                <img
                    src={photoURL}
                    alt={displayName}
                    className='rounded-full mx-auto mb-4 md:m-0'
                />
                <div className='w-max mx-auto'>
                    <p className='text-sm'>
                        <strong className='text-base'>Name: </strong>
                        {displayName ?? 'N/A'}
                    </p>
                    <p className='text-sm'>
                        <strong className='text-base'>Email: </strong>
                        {email ?? 'N/A'}
                    </p>
                    <p className='text-sm'>
                        <strong className='text-base'>Phone: </strong>
                        {phoneNumber ?? 'N/A'}
                    </p>
                    <p className='text-sm flex items-center gap-x-1'>
                        <strong className='text-base'>ID: </strong>
                        {uid ?? 'N/A'}
                        <span
                            className={`dark:bg-gray-600 p-2 rounded cursor-pointer border ml-3 ${
                                copied
                                    ? 'border-emerald-500'
                                    : 'dark:border-white border-black'
                            }`}
                            onClick={handleCopyId}
                        >
                            {copied ? <BsClipboardCheck /> : <BsClipboard />}
                        </span>
                    </p>
                </div>
            </div>
        </ModalTemplate>
    );
}

export default ModalInfo;
