export default function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '448px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          HandyGo
        </h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Welcome to HandyGo
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          ✅ App is running!
        </p>
      </div>
    </div>
  );
}
