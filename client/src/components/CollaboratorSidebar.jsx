export default function CollaboratorSidebar({ users }) {
  return (
    <div
      style={{
        width: 180,
        background: "#111",
        color: "#fff",
        padding: 10,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        aliginItems: "center",
        gap: 10,
        borderRadius: 8,
        border: "2px solid var(--glass-border)",
      
      }}
    >
      <h4>In Room</h4>

      {users.map((u) => (
        <div
          key={u.id}
          style={{ display: "flex", gap: 8, alignItems: "center" , padding: '4px', borderRadius: '4px',"--user-color": u.color }}
          
          className="sidebar"
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: u.color || "#4f46e5"
            }}
          />
          <span>{u.name}</span>
        </div>
      ))}
    </div>
  );
}
