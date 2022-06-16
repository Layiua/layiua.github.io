import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { MdInfo } from 'react-icons/md';

function Header({ detail, setDisplaySetting, displaySetting }) {
    const { roomName, avatarBgColor, chatType, members, theme } = detail;
    const user = useStore((state) => state.user);

    const [friend, setFriend] = useState({});

    useEffect(() => {
        if (chatType === 'friend') {
            const index = members.findIndex((mem) => mem.uid != user.uid);
            setFriend(members[index]);
        }
    }, [chatType]);
    return (
        <header className='w-full flex-between pb-2'>
            <div className='flex-center gap-3'>
                <div
                    className='rounded-full w-12 aspect-square overflow-hidden flex-center'
                    style={{ backgroundColor: avatarBgColor }}
                >
                    {chatType === 'friend' ? (
                        <img src={friend.photoURL} alt='' />
                    ) : (
                        <span className='text-white text-3xl select-none'>
                            {roomName ? roomName[0] : ''}
                        </span>
                    )}
                </div>
                <h4 className='text-white font-medium'>
                    {chatType === 'friend' ? friend.displayName : roomName}
                </h4>
            </div>
            {!displaySetting && (
                <span
                    style={{ color: theme }}
                    className='text-2xl cursor-pointer'
                    onClick={() => setDisplaySetting(true)}
                >
                    <MdInfo />
                </span>
            )}
        </header>
    );
}

export default Header;