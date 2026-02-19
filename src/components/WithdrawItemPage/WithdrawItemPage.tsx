import { useEffect, useState } from 'react';
import { request } from '../../config/api';
import { Item } from '../../structures/classes/Item';
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import './WithdrawItemPage.css';

export default function WithdrawItemPage() {
  const devices = useDevices();

  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string>('');

  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [videoConstraints, setVideoConstraints] = useState<MediaTrackConstraints>({ facingMode: { ideal: 'environment' } });
  const [cameraEnabled, setCameraEnabled] = useState(false);

  useEffect(() => {
    load();
    setVideoConstraints(selectedDevice ? { deviceId: { exact: selectedDevice } } : { facingMode: { ideal: 'environment' } });
  }, []);

  async function load() {
    try {
      const data = await request<any[]>('/list', { method: 'GET' });
      setItems(data.map((raw) => Item.fromApi(raw)));
      setError('');
    } catch (e) {
      setError(String(e));
      setItems(null);
    }
  }

  async function enableCamera() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraEnabled(true);
      setError('');
    } catch (e) {
      setError('Camera permission denied or unavailable.');
      console.error(e);
    }
  }
  
  return (
    <>
      <hr style={{ margin: '30px' }} />

      <div className='scanner-container'>
        <div className='scanner-config-container'>
          <select style={{ margin: '0 0 30px 0' }} value={selectedDevice} onChange={(e) => {
            setSelectedDevice(e.target.value);
            setVideoConstraints(e.target.value ? { deviceId: { exact: e.target.value } } : { facingMode: { ideal: 'environment' } });
          }}>
            <option value=''> Select a camera </option>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>

          {!cameraEnabled ? (
            <button style={{ margin: '30px' }} onClick={enableCamera}> Enable camera </button>
          ) : (
            <Scanner 
              onScan={(result) => console.log(result)}
              formats={['qr_code', 'ean_13', 'ean_8']}
              constraints={{...videoConstraints}}
              onError={(err) => {
                console.error("Scanner error:", err);
                setError(String(err));
              }}
            />
          )}
        </div>
        <div className='scanned-element-container'>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>

      <hr style={{ width: '50%', margin: '30px auto' }} />
      
      {items === null && <p>Loading…</p>}
      {items && items.length === 0 && <p>No items available</p>}
      {items && items.length > 0 && (
        <div className='item-list-container'>
          {items.map((item) => (
            <div key={item.id}>
              {item.getButtonItemComponent(load)}
            </div>
          ))}
        </div>
      )}
    </>
  );
}