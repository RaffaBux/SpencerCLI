import { useEffect, useState } from 'react';
import { request } from '../../config/api';
import { Item } from '../../structures/classes/Item';
import { Scanner, useDevices, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import './WithdrawItemPage.css';

export default function WithdrawItemPage() {
  const devices = useDevices();

  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string>('');

  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [videoConstraints, setVideoConstraints] = useState<MediaTrackConstraints | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  useEffect(() => {
    load();
    setVideoConstraints(selectedDevice ? { deviceId: { exact: selectedDevice } } : null);
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

  function handleScan(detectedCodes: IDetectedBarcode[]) {
    console.log('Detected codes:', detectedCodes);
    detectedCodes.forEach((code) => {
      console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
    });
  };

  function highlightCode(detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) {
    detectedCodes.forEach((detectedCode) => {
      const { boundingBox, cornerPoints } = detectedCode;
      
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 4;
      ctx.strokeRect(
        boundingBox.x,
        boundingBox.y,
        boundingBox.width,
        boundingBox.height
      );
      
      ctx.fillStyle = '#FF0000';
      cornerPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };
  
  return (
    <>
      <hr style={{ margin: '30px' }} />

      <div className='scanner-container'>
        <div className='scanner-config-container'>
          <div>
            <select style={{ margin: '0 0 30px 0' }} value={selectedDevice} onChange={(event) => {
              setSelectedDevice(event.target.value);
              setVideoConstraints(event.target.value ? { deviceId: { exact: event.target.value } } : null);
            }}>
              <option value=''> Select a camera </option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId}`}
                </option>
              ))}
            </select>

            <button 
              style={{ margin: '30px' }} 
              onClick={() => {
                setCameraEnabled(!cameraEnabled)
              }}
            >
              {cameraEnabled ? 'Disable camera' : 'Enable camera'}
            </button>
          </div>
          
          {cameraEnabled ? (
            <Scanner 
              onScan={handleScan}
              formats={['qr_code', 'ean_13', 'ean_8']}
              components={{
                tracker: highlightCode,
              }}
              constraints={{...videoConstraints}}
              onError={(err) => {
                console.error("Scanner error:", err);
                setError(String(err));
              }}
            />
          ) : null}
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