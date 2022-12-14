import ModalTemplate from '../../ModalTemplate';
import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import {
    getUser,
    addNewRoom,
    addRoomIdToUser,
    isCreateRoom,
} from '../../../firebase/functionHandler';
import { useStore } from '../../../store';
import { useNavigate } from 'react-router-dom';

function ModalConversation() {
    const { displayName, photoURL, uid } = useStore((state) => state.user);
    const setModalName = useStore((state) => state.setModalName);

    const navigate = useNavigate();

    const [roomName, setRoomName] = useState('');
    const [friendID, setFriendID] = useState('');
    const [members, setMembers] = useState([]);
    const [message, setMessage] = useState('');
    const [chatType, setChatType] = useState('friend');

    useEffect(() => {
        setMembers([
            { displayName, photoURL, uid, isAdmin: true, nickname: '' },
        ]);
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (members.length < 2) {
            setMessage('Need at least 2 members to create conversation!');
            return;
        }
        const isCreate = await isCreateRoom(members[1]);
        if (chatType === 'friend' && isCreate.size) {
            isCreate.forEach((doc) => navigate('/' + doc.id));
            setDisplayModal('');
        } else {
            const { id } = await addNewRoom({ roomName, members, chatType });
            members.forEach(async (member) => {
                const { uid } = member;
                const user = await getUser(uid);
                user.forEach((doc) => addRoomIdToUser(doc.id, id));
            });
        }
        setModalName('');
    };

    const handleAddMember = async () => {
        if (!(await getUser(friendID)).size && friendID) {
            setMessage('This ID does not exist!');
            return;
        }
        if (chatType === 'friend' && members.length === 2 && friendID) {
            setMessage('If you want more than 2 members, please select group!');
            return;
        }
        if (members.length > 30) {
            setMessage('The maximum number of members has been reached!');
            return;
        }
        const isAdded = members.some((member) => member.uid === friendID);
        if (isAdded) {
            setMessage('This member has been added!');
            return;
        } else {
            const member = await getUser(friendID);
            member.forEach((doc) => {
                setMembers((prev) => [
                    ...prev,
                    {
                        displayName: doc.data().displayName,
                        photoURL: doc.data().photoURL,
                        uid: doc.data().uid,
                        isAdmin: false,
                        nickname: '',
                    },
                ]);
                if (chatType === 'friend') {
                    setRoomName(doc.data().displayName);
                }
            });
            setFriendID('');
            setMessage('');
        }
    };

    const handleDeleteMember = (uid) => {
        const currentMembers = members.filter((member) => member.uid !== uid);
        setMembers(currentMembers);
        if (chatType === 'friend') {
            setRoomName('');
        }
    };

    const handleFriendType = () => {
        setChatType('friend');
        members[1] ? setRoomName(members[1].displayName) : setRoomName('');
        if (members.length > 2) {
            members.length = 2;
        }
    };

    return (
        <ModalTemplate>
            <div className='flex-center justify-around border-b border-gray-500 mb-3'>
                <button
                    type='button'
                    className={`flex-1 py-2 ${
                        chatType === 'friend' && 'bg-gray-300 dark:bg-lightDark'
                    }`}
                    onClick={handleFriendType}
                >
                    Friend
                </button>
                <button
                    type='button'
                    className={`flex-1 py-2 ${
                        chatType === 'group' && 'bg-gray-300 dark:bg-lightDark'
                    }`}
                    onClick={() => setChatType('group')}
                >
                    Group
                </button>
            </div>
            <form onSubmit={handleCreate}>
                <label>Name</label>
                <input
                    type='text'
                    className='input-dark mt-1 mb-3'
                    required
                    placeholder='Room Name'
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    readOnly={chatType === 'friend'}
                />
                <label>
                    {chatType === 'friend' ? "Friend's ID" : "Member's ID"}
                </label>
                <div className='flex-center gap-2 mt-1 mb-3'>
                    <input
                        type='text'
                        placeholder="Friend's ID"
                        className='input-dark'
                        value={friendID}
                        onChange={(e) => setFriendID(e.target.value)}
                    />
                    <button
                        type='button'
                        className='modal-btn bg-emerald-500 hover:bg-emerald-600'
                        onClick={handleAddMember}
                    >
                        Add
                    </button>
                </div>
                <p className='text-red-600 text-sm mb-3'>{message}</p>
                <ul className='flex items-center flex-wrap gap-2'>
                    {members.map((member) => (
                        <li
                            className='w-12 aspect-square relative'
                            key={member.uid}
                        >
                            <img
                                src={member.photoURL}
                                className='rounded-full'
                            />
                            {!member.isAdmin && (
                                <span
                                    className='absolute -top-1 -right-1 p-0.5 bg-gray-500 text-sm rounded-full cursor-pointer first:hidden'
                                    onClick={() =>
                                        handleDeleteMember(member.uid)
                                    }
                                >
                                    <IoClose />
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
                <div className='flex-center justify-end gap-2 mt-4'>
                    <button
                        className='modal-btn bg-red-500 hover:bg-red-600'
                        type='button'
                        onClick={() => setModalName('')}
                    >
                        Cancel
                    </button>
                    <button
                        className='modal-btn bg-blue-500 hover:bg-blue-600'
                        type='submit'
                    >
                        Create
                    </button>
                </div>
            </form>
        </ModalTemplate>
    );
}

export default ModalConversation;
