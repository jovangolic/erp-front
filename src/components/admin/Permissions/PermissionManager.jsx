import React, { useState, useEffect } from "react";
import { 
  getAll, 
  cratePermission, 
  deletePermission, 
  updatePermission,
  getPermissionById
} from "../../utils/permissionApi"; // pretpostavljam da su u ovom folderu

const PermissionManager = () => {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState("");
  const [editId, setEditId] = useState(null);
  const [editPermissionType, setEditPermissionType] = useState("");

  useEffect(() => {
    loadPermissions();
  }, []);

  async function loadPermissions() {
    const data = await getAll();
    setPermissions(data);
  }

  const handleCreate = async () => {
    if (!newPermission) return alert("Unesi permisiju");
    await cratePermission(newPermission);
    setNewPermission("");
    loadPermissions();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete?")) {
      await deletePermission(id);
      loadPermissions();
    }
  };

  const startEdit = (perm) => {
    setEditId(perm.id);
    setEditPermissionType(perm.permissionType);
  };

  const handleUpdate = async () => {
    if (!editPermissionType) return alert("Unesi permisiju");
    await updatePermission(editId, editPermissionType);
    setEditId(null);
    setEditPermissionType("");
    loadPermissions();
  };

  return (
    <div>
      <h2>Permission Manager</h2>
      
      <input
        type="text"
        placeholder="Nova permisija (npr. CREATE_ORDER)"
        value={newPermission}
        onChange={(e) => setNewPermission(e.target.value.toUpperCase())}
      />
      <button onClick={handleCreate}>Dodaj permisiju</button>

      <ul>
        {permissions.map((perm) => (
          <li key={perm.id}>
            {editId === perm.id ? (
              <>
                <input
                  type="text"
                  value={editPermissionType}
                  onChange={(e) => setEditPermissionType(e.target.value.toUpperCase())}
                />
                <button onClick={handleUpdate}>Sačuvaj</button>
                <button onClick={() => setEditId(null)}>Otkaži</button>
              </>
            ) : (
              <>
                <span>{perm.permissionType}</span>
                <button onClick={() => startEdit(perm)}>Izmeni</button>
                <button onClick={() => handleDelete(perm.id)}>Obriši</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermissionManager;