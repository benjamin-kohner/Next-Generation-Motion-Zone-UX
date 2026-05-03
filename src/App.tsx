/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import CameraView from './components/CameraView';
import DrawZoneEditor from './components/DrawZoneEditor';
import GridZoneEditor from './components/GridZoneEditor';
import { ChevronLeft, Info, ChevronRight, Plus, Trash2, Check, Wand2, Battery, Wifi, SignalHigh, BellOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const CAMERA_IMAGE = "/doorbell_camera.jpg";

export default function App() {
  const [screen, setScreen] = useState<'start' | 'main' | 'zones' | 'edit'>('start');
  const [mode, setMode] = useState<'ring' | 'ring-large' | 'draw' | 'grid' | 'ring-ai'>('ring');

  const defaultPoints = [
    { id: '1', x: 0, y: 0 },
    { id: '2', x: 50, y: 0 },
    { id: '3', x: 100, y: 0 },
    { id: '4', x: 100, y: 50 },
    { id: '5', x: 100, y: 100 },
    { id: '6', x: 50, y: 100 },
    { id: '7', x: 0, y: 100 },
    { id: '8', x: 0, y: 50 },
  ];

  const aiPoints = [
    { id: '1', x: 32, y: 50 },
    { id: '2', x: 68, y: 50 },
    { id: '3', x: 85, y: 70 },
    { id: '4', x: 95, y: 98 },
    { id: '5', x: 50, y: 100 },
    { id: '6', x: 5, y: 98 },
    { id: '7', x: 15, y: 70 },
    { id: '8', x: 28, y: 55 },
  ];

  const [points, setPoints] = useState(defaultPoints);
  const [drawPoints, setDrawPoints] = useState<any[]>([]);
  const [gridCells, setGridCells] = useState<boolean[]>(() => {
    const defaultGrid = new Array(100).fill(false);
    for (let r = 3; r < 8; r++) {
       for (let c = 2; c < 8; c++) {
           defaultGrid[r*10 + c] = true;
       }
    }
    return defaultGrid;
  });

  const handleStart = (selectedMode: 'ring' | 'ring-large' | 'draw' | 'grid' | 'ring-ai') => {
    setMode(selectedMode);
    if (selectedMode === 'ring-ai') {
      setPoints(aiPoints);
    } else {
      setPoints(defaultPoints);
    }
    setDrawPoints([]);
    setScreen('main');
  };
  const [zoneName, setZoneName] = useState('Default Zone');
  const [showToast, setShowToast] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [currentTime, setCurrentTime] = useState("8:21");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours > 12 ? hours - 12 : hours === 0 ? 12 : hours}:${minutes}`);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setScreen('main');
      setHasEdited(false);
    }, 2000);
  };

  const StatusBar = ({ isDark = true }) => (
    <div className={`flex items-center justify-between px-6 py-3 shrink-0 text-white ${isDark ? 'bg-black' : 'bg-black absolute top-0 w-full z-50'}`}>
      <div className="flex items-center gap-1 font-semibold text-[15px] tracking-wide">
        {currentTime} <BellOff size={12} className="ml-0.5" />
      </div>
      <div className="flex items-center gap-1.5">
        <SignalHigh size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <div className="relative flex items-center justify-center">
          <Battery size={22} strokeWidth={1.5} className="text-white" />
          <div className="absolute left-[3px] bg-white h-[9px] w-[13px] rounded-[1px]" />
        </div>
      </div>
    </div>
  );

  const renderCameraArea = (isEditable: boolean, children?: React.ReactNode) => {
    switch (mode) {
      case 'draw':
        return (
          <DrawZoneEditor 
            imageUrl={CAMERA_IMAGE} 
            points={drawPoints} 
            isEditable={isEditable} 
            onPointsChange={setDrawPoints} 
          >
            {children}
          </DrawZoneEditor>
        );
      case 'grid':
        return (
          <GridZoneEditor 
            imageUrl={CAMERA_IMAGE} 
            cells={gridCells} 
            isEditable={isEditable} 
            onCellsChange={setGridCells} 
          >
            {children}
          </GridZoneEditor>
        );
      case 'ring-large':
      case 'ring-ai':
      case 'ring':
      default:
        return (
          <CameraView 
            imageUrl={CAMERA_IMAGE} 
            points={points} 
            isEditable={isEditable} 
            onPointsChange={setPoints}
            largeGrabPoints={mode === 'ring-large'}
          >
            {children}
          </CameraView>
        );
    }
  };

  const TopNav = ({ rightAction, isDark = true, showWand = false }: { rightAction?: React.ReactNode, isDark?: boolean, showWand?: boolean }) => (
    <div className={`flex items-center justify-between px-4 pb-3 pt-1 shrink-0 ${isDark ? 'bg-black text-white' : 'bg-white border-b border-gray-200'}`}>
      <div className="flex-1">
        <button 
          onClick={() => {
            if (screen === 'edit') setScreen('zones');
            else if (screen === 'zones') setScreen('main');
            else if (screen === 'main') setScreen('start');
          }}
          className={`${isDark ? 'text-[#3695ce]' : 'text-[#3695ce]'}`}
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
      </div>
      <h1 className={`text-lg font-semibold text-center flex-1 whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-900'}`}>Front Door</h1>
      <div className={`flex-1 flex justify-end text-[15px] font-medium ${isDark ? 'text-[#3695ce]' : 'text-[#3695ce]'}`}>
        {showWand ? (
          <button className="text-[#3695ce] cursor-not-allowed">
            <Wand2 size={24} strokeWidth={1.5} />
          </button>
        ) : rightAction ? rightAction : <div className="w-6 h-6" />}
      </div>
    </div>
  );

  return (
    <div className="flex justify-center bg-gray-900 min-h-screen sm:items-center sm:p-8">
      <div className="w-full h-[100dvh] sm:h-[852px] sm:max-w-[393px] bg-black flex flex-col relative overflow-hidden sm:rounded-[3rem] sm:border-[8px] sm:border-gray-800 shadow-2xl">
        
        {/* Start Screen */}
        <AnimatePresence mode="wait">
          {screen === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col h-full bg-[#121212] absolute inset-0 z-50 p-6 pt-16 items-center"
            >
              <h1 className="text-2xl font-bold text-white mb-2 text-center">Select Prototype</h1>
              <p className="text-gray-400 text-center text-[15px] mb-12">
                Choose a setup experience to test different interaction models for configuring motion zones.
              </p>

              <div className="w-full flex flex-col space-y-4 overflow-y-auto no-scrollbar pb-12 pt-2">
                <button onClick={() => handleStart('ring')} className="w-full shrink-0 bg-[#2a2a2a] py-4 px-5 rounded-xl flex items-center justify-between border border-[#333] hover:border-[#3695ce] active:scale-95 transition-all text-left shadow-md">
                  <div className="pr-4">
                    <h2 className="text-white font-semibold text-[17px]">Ring app current</h2>
                    <p className="text-[#a5a5a5] text-[13px] mt-1 leading-snug">Move 8 interconnected points around the camera feed.</p>
                  </div>
                  <ChevronRight className="text-[#666] shrink-0" size={20} />
                </button>

                <button onClick={() => handleStart('ring-ai')} className="w-full shrink-0 bg-[#2a2a2a] py-4 px-5 rounded-xl flex items-center justify-between border border-[#333] border-l-4 border-l-[#3695ce] hover:border-[#3695ce] active:scale-95 transition-all text-left shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <Wand2 className="text-[#3695ce]/20" size={64} />
                  </div>
                  <div className="pr-4 relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#3695ce]/20 text-[#3695ce] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Recommended Approach</span>
                    </div>
                    <h2 className="text-white font-semibold text-[17px] flex items-center gap-2">Ring App with Initial AI Zone Recommendation <Wand2 size={16} className="text-[#3695ce]" /></h2>
                    <p className="text-[#a5a5a5] text-[13px] mt-1 leading-snug">Intelligently sets the zone to minimize noise and focus on the things that you care about. Features larger adjustment points.</p>
                  </div>
                  <ChevronRight className="text-[#666] shrink-0 relative z-10" size={20} />
                </button>

                <button onClick={() => handleStart('draw')} className="w-full shrink-0 bg-[#2a2a2a] py-4 px-5 rounded-xl flex items-center justify-between border border-[#333] hover:border-[#3695ce] active:scale-95 transition-all text-left shadow-md opacity-70">
                  <div className="pr-4">
                    <h2 className="text-white font-semibold text-[17px]">User draw tool <span className="text-gray-500 font-normal text-sm ml-1">(Not Recommended)</span></h2>
                    <p className="text-[#a5a5a5] text-[13px] mt-1 leading-snug">Freehand draw a motion shape with your finger.</p>
                  </div>
                  <ChevronRight className="text-[#666] shrink-0" size={20} />
                </button>

                <button onClick={() => handleStart('grid')} className="w-full shrink-0 bg-[#2a2a2a] py-4 px-5 rounded-xl flex items-center justify-between border border-[#333] hover:border-[#3695ce] active:scale-95 transition-all text-left shadow-md opacity-70">
                  <div className="pr-4">
                    <h2 className="text-white font-semibold text-[17px]">10x10 Grid Overlay <span className="text-gray-500 font-normal text-sm ml-1">(Not Recommended)</span></h2>
                    <p className="text-[#a5a5a5] text-[13px] mt-1 leading-snug">Tap or drag over squares to toggle detection areas.</p>
                  </div>
                  <ChevronRight className="text-[#666] shrink-0" size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Screen */}
        {screen === 'main' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-[#121212] absolute inset-0 z-10"
          >
            <StatusBar />
            <TopNav rightAction={null} isDark={true} showWand={true} />
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
              <div className="relative shrink-0 bg-black">
                {renderCameraArea(false, (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                    <button 
                      onClick={() => setScreen('zones')}
                      className="bg-white px-5 py-2.5 rounded shadow-sm text-sm font-bold text-[#3695ce] uppercase tracking-widest active:scale-95 transition-transform"
                    >
                      Edit Zones
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-[#121212] min-h-max">
                <div className="bg-[#212121] px-4 py-5 mb-0">
                  <h2 className="text-[20px] font-semibold text-white mb-5 tracking-wide">Motion Settings</h2>
                
                <div className="rounded border border-[#0d7396] bg-[#222c32] overflow-hidden">
                  <div className="p-4 flex items-center">
                    <div className="bg-[#3695ce] rounded-full w-[22px] h-[22px] flex items-center justify-center shrink-0">
                      <span className="text-white text-[12px] font-bold">2</span>
                    </div>
                    <p className="ml-3 text-white font-medium text-[15px]">Make motion detection work for you.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#212121] mb-[1px]">
                <div className="bg-[#121212] py-2 px-4">
                  <h3 className="text-[13px] font-semibold text-[#a5a5a5] tracking-wider">Zones</h3>
                </div>
                <div 
                  onClick={() => setScreen('zones')}
                  className="py-4 px-4 flex items-center justify-between cursor-pointer active:bg-[#2a2a2a] transition-colors"
                >
                  <div className="pr-4">
                    <h4 className="text-[17px] font-medium text-white mb-1.5">Camera Motion Zones</h4>
                    <p className="text-[14px] text-[#a5a5a5] leading-snug">Draw areas on the camera view to watch for motion. Your camera will not detect motion outside these areas.</p>
                  </div>
                  <ChevronRight size={20} className="text-[#666] shrink-0" />
                </div>
              </div>

              <div className="bg-[#212121] mb-8">
                <div className="bg-[#121212] py-2 px-4">
                  <h3 className="text-[13px] font-semibold text-[#a5a5a5] tracking-wider">Settings</h3>
                </div>
                <div className="py-4 px-4 flex items-center justify-between active:bg-[#2a2a2a] transition-colors cursor-pointer border-b border-[#333]">
                  <div className="pr-4">
                    <h4 className="text-[17px] font-medium text-white mb-1.5">Motion Sensitivity</h4>
                    <p className="text-[14px] text-[#a5a5a5] leading-snug">Adjust the effective range of motion detection for this device.</p>
                  </div>
                  <ChevronRight size={20} className="text-[#666] shrink-0" />
                </div>
                <div className="py-4 px-4 flex items-center justify-between active:bg-[#2a2a2a] transition-colors cursor-pointer border-b border-[#333]">
                  <div className="pr-4">
                    <h4 className="text-[17px] font-medium text-white mb-1.5">Smart Alerts</h4>
                    <p className="text-[14px] text-[#a5a5a5] leading-snug">Get the Motion Alerts and recordings you want, and ignore the rest.</p>
                  </div>
                  <div className="flex items-center text-[#a5a5a5]">
                    <span className="mr-2 text-[17px]">On</span>
                    <ChevronRight size={20} className="text-[#666] shrink-0" />
                  </div>
                </div>
                <div className="py-4 px-4 flex items-center justify-between active:bg-[#2a2a2a] transition-colors cursor-pointer border-b border-[#333]">
                  <div className="pr-4">
                    <h4 className="text-[17px] font-medium text-white mb-1.5">Motion Schedules</h4>
                    <p className="text-[14px] text-[#a5a5a5] leading-snug">Avoid getting Motion Alerts during certain times and days.</p>
                  </div>
                  <ChevronRight size={20} className="text-[#666] shrink-0" />
                </div>
                <div className="py-4 px-4 flex items-center justify-between active:bg-[#2a2a2a] transition-colors cursor-pointer">
                  <div className="pr-4">
                    <h4 className="text-[17px] font-medium text-white mb-1.5">Advanced Settings</h4>
                    <p className="text-[14px] text-[#a5a5a5] leading-snug">Customize motion detection to fit your preferences and reduce unwanted alerts.</p>
                  </div>
                  <ChevronRight size={20} className="text-[#666] shrink-0" />
                </div>
              </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Zones List Screen */}
        <AnimatePresence>
          {screen === 'zones' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full bg-black absolute inset-0 z-20"
            >
              <StatusBar isDark={true} />
              <TopNav rightAction={<button onClick={handleSave} className="font-semibold tracking-wide">Save</button>} isDark={true} />
              
              <div className="flex-1 overflow-y-auto no-scrollbar bg-[#121212]">
                <div className="relative shrink-0 bg-black">
                  {renderCameraArea(false)}
                </div>

                <div className="bg-[#121212] min-h-max pb-12">
                  {hasEdited && (
                    <div className="p-4 bg-[#212121] border-b border-[#333] shadow-sm">
                      <p className="text-[15px] text-white">You can create up to three Motion Zones.</p>
                    </div>
                  )}
                <div className="px-4 py-2 mt-1">
                  <h3 className="text-[13px] font-semibold text-[#a5a5a5] tracking-wider">Motion Zones</h3>
                </div>
                
                <div className="bg-[#212121] pl-4 py-1 shadow-sm mt-1">
                  <div className="flex items-start py-3">
                    <div className="w-[18px] h-[18px] rounded-full bg-[#3695ce] mt-0.5 mr-4 shrink-0 shadow-sm" />
                    <div className="flex-1 border-b border-[#333] pb-4 pr-4">
                      <p className="text-[17px] text-white font-medium">{zoneName}</p>
                      <button 
                        onClick={() => {
                          if (mode === 'draw') setDrawPoints([]);
                          setScreen('edit');
                        }}
                        className="text-[#3695ce] font-medium mt-1 text-[15px] active:opacity-70"
                      >
                        Edit Zone
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center py-4 cursor-not-allowed opacity-40">
                    <div className="mr-3 shrink-0 w-[22px] h-[22px] border-[2.5px] border-[#a5a5a5] rounded-full flex items-center justify-center">
                      <Plus size={14} className="text-[#a5a5a5]" strokeWidth={3} />
                    </div>
                    <span className="text-[17px] text-white font-medium">Add Motion Zone</span>
                  </div>
                </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Edit Zone Screen */}
          {screen === 'edit' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col h-full bg-black absolute inset-0 z-30"
            >
              <StatusBar isDark={true} />
              <TopNav rightAction={<button onClick={handleSave} className="font-semibold tracking-wide">Save</button>} isDark={true} />
              
              <div className="flex-1 overflow-y-auto no-scrollbar bg-[#121212] pb-24">
                <div className="relative shrink-0 bg-black">
                  {renderCameraArea(true)}
                </div>

                <div className="bg-[#121212] min-h-max">
                  <div className="px-4 py-4 mt-2">
                    <label className="text-[13px] text-[#a5a5a5] mb-1.5 block font-semibold tracking-wider">Zone Name</label>
                    <div className="bg-[#212121] border border-[#333] rounded-sm p-3 focus-within:border-[#3695ce] focus-within:ring-1 focus-within:ring-[#3695ce]">
                      <input 
                        type="text" 
                        value={zoneName}
                        onChange={(e) => setZoneName(e.target.value)}
                        className="w-full outline-none text-[17px] text-white bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-2 bg-[#212121] shadow-sm">
                    <button className="flex items-center w-full p-4 text-[#ff4d4f] hover:bg-[#2a2a2a] active:bg-[#2a2a2a] transition-colors">
                      <Trash2 size={22} className="mr-4" strokeWidth={1.5} />
                      <span className="text-[17px] font-medium">Delete Zone</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Done Button */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#121212]">
                <button 
                  onClick={() => {
                    setHasEdited(true);
                    setScreen('zones');
                  }}
                  className="w-full bg-[#3695ce] text-white font-bold tracking-widest py-3.5 rounded outline-none active:bg-[#267bb0] transition-colors text-[15px]"
                >
                  DONE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 transition-colors"
            >
              <div className="bg-[#212121] rounded-xl p-8 flex flex-col items-center justify-center shadow-2xl w-4/5 max-w-[240px]">
                <Check size={56} className="text-[#00aa00] font-light mb-5" strokeWidth={1.5} />
                <p className="text-white text-lg font-medium">Settings saved!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}


