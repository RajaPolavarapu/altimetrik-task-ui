import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, updateUser } from '../redux/userDetailsSlice';
import { logoutUser } from '../redux/authSlice';
import '../assets/css/UserDetails.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

const UserDetails = () => {
    const { users: { users } } = useSelector((state) => state);
    let [params, setParams] = useSearchParams();
    const navigate = useNavigate();

    const urlEditId = params.get("editing");
    const token = localStorage.getItem("jwtToken");

    const dispatch = useDispatch();
    const [editingRowId, setEditingRowId] = useState(() => urlEditId);
    const [editData, setEditData] = useState({});
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(3);

    const fetchUsers = async () => {
        dispatch(getUsers())
    };

    useEffect(() => {
        setEditingRowId(urlEditId);
        setEditData(users.filter(d => d.id === urlEditId)[0] || {});
    }, [urlEditId, users]);

    useEffect(() => {
        if (!token) {
            navigate("/")
        }
    }, [token]);

    useEffect(() => {
        fetchUsers()
    }, []);

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handleEdit = (user) => {
        setParams({
            editing: user.id
        });
        setEditingRowId(user.id);
        setEditData(user);
    };

    const handleCancel = () => {
        setEditingRowId(null);
        setEditData({});
    };

    const handleSave = () => {
        setParams({});
        dispatch(updateUser(editData));
        setEditingRowId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/")
    }

    return (
        <div className="user-details-container">
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
            <h2>User Details</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.slice(startIndex, endIndex).map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            {editingRowId === user.id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={editData.first_name}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={editData.last_name}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="address"
                                            value={editData.address}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.address}</td>
                                    <td>
                                        <button onClick={() => handleEdit(user)}>Edit</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                >
                    Previous
                </button>
                <span>{page}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={endIndex >= users.length}
                >
                    Next
                </button>
                <label>Rows per page:</label>
                <select value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))}>
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                </select>
            </div>
        </div>
    );
};

export default UserDetails;
