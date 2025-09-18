import React, { useState, useEffect } from 'react';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import uyeKartAlt from '../assets/uye_kart_alt.jpg';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Checkbox } from '../components/ui/checkbox';
import { Printer, Edit, RotateCcw, Save, Users, Plus, ZoomIn, ZoomOut } from 'lucide-react';
import { visitsService } from '../services/visits.service';
import { groupMeetingsService } from '../services/groupMeetings.service';
import './PagePrint.css';
import { useGroup } from '../contexts/GroupContext';

const PagePrint6 = () => {  
  const { selectedGroupContext } = useGroup();
  const [visitors, setVisitors] = useState([]); // Varsayılan gösterim için filtrelenmiş ziyaretçiler
  const [allVisitors, setAllVisitors] = useState([]); // Dialog için tüm ziyaretçiler
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [addedVisitors, setAddedVisitors] = useState([]); // Eklenen ziyaretçileri takip et
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom seviyesi (1 = normal, 0.8 = küçük, 1.2 = büyük)
  const [pages, setPages] = useState([
    Array.from({ length: 9 }, (_, index) => ({
      id: index,
      name: 'İsim Soyisim',
      profession: 'Kategori',
      invitedBy: 'Davet Eden',
      isEmpty: true
    }))
  ]);

  useEffect(() => {
    fethVisitors();
  }, [selectedGroupContext]);


  const fethVisitors = async () => {
    setIsLoading(true);
    try {
      const [visitorsResponse, meetingsResponse] = await Promise.all([
        visitsService.getVisits(selectedGroupContext.id),
        groupMeetingsService.getGroupMeetings(selectedGroupContext.id)
      ]);
      
      console.log("Ziyaretçiler alındı:", visitorsResponse);
      console.log("Toplantılar alındı:", meetingsResponse);
      
      // Tüm ziyaretçileri kaydet (dialog için)
      setAllVisitors(visitorsResponse);
      
      // Bugüne en yakın toplantıyı bul (varsayılan gösterim için)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Toplantıları tarihe göre sırala (bugüne en yakından başlayarak)
      const sortedMeetings = meetingsResponse
        .map(meeting => ({
          ...meeting,
          dateObj: new Date(meeting.date)
        }))
        .sort((a, b) => {
          const diffA = Math.abs(a.dateObj - today);
          const diffB = Math.abs(b.dateObj - today);
          return diffA - diffB;
        });
      
      if (sortedMeetings.length > 0) {
        const nearestMeeting = sortedMeetings[0];
        console.log("Bugüne en yakın toplantı:", nearestMeeting);
        
        // Sadece en yakın toplantı tarihindeki ziyaretçileri filtrele (varsayılan gösterim için)
        const filteredVisitors = visitorsResponse.filter(visitor => 
          visitor.meeting === nearestMeeting.id
        );
        
        console.log("Filtrelenmiş ziyaretçiler:", filteredVisitors);
        setVisitors(filteredVisitors);
        
        // Filtrelenmiş ziyaretçileri otomatik olarak kartlara ekle
        if (filteredVisitors.length > 0) {
          // Kartları temizle ve yeni ziyaretçileri ekle
          const initialPages = [
            Array.from({ length: 9 }, (_, index) => ({
              id: index,
              name: 'İsim Soyisim',
              profession: 'Kategori',
              invitedBy: 'Davet Eden',
              isEmpty: true
            }))
          ];
          
          const newPages = [...initialPages];
          const newAddedVisitors = [];
          
          filteredVisitors.forEach((visitor, index) => {
            const pageIndex = Math.floor(index / 9);
            const cardIndex = index % 9;
            
            // Yeni sayfa gerekiyorsa oluştur
            while (newPages.length <= pageIndex) {
              newPages.push(Array.from({ length: 9 }, (_, idx) => ({
                id: newPages.length * 9 + idx,
                name: 'İsim Soyisim',
                profession: 'Kategori',
                invitedBy: 'Davet Eden',
                isEmpty: true
              })));
            }
            
            // Ziyaretçiyi karta ekle
            newPages[pageIndex][cardIndex] = {
              id: newPages[pageIndex][cardIndex].id,
              name: visitor.full_name || 'İsim Soyisim',
              profession: visitor.category || 'Kategori',
              invitedBy: visitor.invited_by_full_name || 'Davet Eden',
              isEmpty: false,
              visitorId: visitor.id
            };
            
            newAddedVisitors.push(visitor.id);
          });
          
          setPages(newPages);
          setAddedVisitors(newAddedVisitors);
        }
      } else {
        console.log("Toplantı bulunamadı");
        setVisitors([]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Ziyaretçiler alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    // Eğer sayfa döndürülmüşse, önce döndürmeyi kaldır
    const wasRotated = isRotated;
    if (wasRotated) {
      setIsRotated(false);
    }
    
    // PDF adını dinamik olarak ayarla
    const originalTitle = document.title;
    const currentDate = new Date().toLocaleDateString('tr-TR').replace(/\./g, '-');
    document.title = `BNI_${selectedGroupContext?.name || 'Grup'}_Ziyaretci_Kartı`;
    
    // Kısa bir gecikme ile yazdırma işlemini başlat (DOM güncellemesi için)
    setTimeout(() => {
      window.print();
      
      // Yazdırma işlemi tamamlandıktan sonra orijinal title'ı geri yükle
      setTimeout(() => {
        document.title = originalTitle;
        // Eğer sayfa önceden döndürülmüşse, yazdırma sonrası tekrar döndür
        if (wasRotated) {
          setIsRotated(true);
        }
      }, 1000);
    }, 100);
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  }

  const handleRotateToggle = () => {
    setIsRotated(!isRotated);
  }

  const handleCardUpdate = (pageIndex, cardIndex, field, value) => {
    setPages(prevPages => 
      prevPages.map((page, pIndex) => 
        pIndex === pageIndex
          ? page.map((card, cIndex) => 
              cIndex === cardIndex 
                ? { ...card, [field]: value }
                : card
            )
          : page
      )
    );
  }

  const handleSave = () => {
    setIsEditing(false);
    // Burada verileri backend'e kaydetme işlemi yapılabilir
    console.log('Kart verileri kaydedildi:', pages);
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.01, 2)); // Maksimum 2x zoom
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.01, 0.5)); // Minimum 0.5x zoom
  }

  const resetZoom = () => {
    setZoomLevel(1);
  }

  const handleVisitorSelection = (visitorId, isSelected) => {
    if (isSelected) {
      // Eğer ziyaretçi zaten eklenmişse, sadece seçili listesine ekle
      if (!addedVisitors.includes(visitorId)) {
        setSelectedVisitors(prev => [...prev, visitorId]);
      }
    } else {
      // Eğer ziyaretçi eklenmişse, hem seçili listesinden hem de eklenen listesinden çıkar
      setSelectedVisitors(prev => prev.filter(id => id !== visitorId));
      if (addedVisitors.includes(visitorId)) {
        removeVisitorFromCards(visitorId);
      }
    }
  }

  const handleSelectAllVisitors = () => {
    const availableVisitors = allVisitors.filter(visitor => !addedVisitors.includes(visitor.id));
    if (selectedVisitors.length === availableVisitors.length) {
      setSelectedVisitors([]);
    } else {
      setSelectedVisitors(availableVisitors.map(visitor => visitor.id));
    }
  }

  const addVisitorsToCards = (visitorsToAdd) => {
    const newPages = [...pages];
    const newAddedVisitors = [...addedVisitors];
    
    // Mevcut dolu kartları say
    let currentCardIndex = 0;
    
    // Mevcut dolu kartları bul
    for (let pageIdx = 0; pageIdx < newPages.length; pageIdx++) {
      for (let cardIdx = 0; cardIdx < newPages[pageIdx].length; cardIdx++) {
        if (!newPages[pageIdx][cardIdx].isEmpty) {
          currentCardIndex++;
        }
      }
    }
    
    visitorsToAdd.forEach((visitor) => {
      // Zaten eklenmişse atla
      if (newAddedVisitors.includes(visitor.id)) return;
      
      const pageIndex = Math.floor(currentCardIndex / 9);
      const cardIndex = currentCardIndex % 9;
      
      // Yeni sayfa gerekiyorsa oluştur
      while (newPages.length <= pageIndex) {
        newPages.push(Array.from({ length: 9 }, (_, index) => ({
          id: newPages.length * 9 + index,
          name: 'İsim Soyisim',
          profession: 'Kategori',
          invitedBy: 'Davet Eden',
          isEmpty: true
        })));
      }
      
      // Ziyaretçiyi karta ekle
      newPages[pageIndex][cardIndex] = {
        id: newPages[pageIndex][cardIndex].id,
        name: visitor.full_name || 'İsim Soyisim',
        profession: visitor.category || 'Kategori',
        invitedBy: visitor.invited_by_full_name || 'Davet Eden',
        isEmpty: false,
        visitorId: visitor.id
      };
      
      newAddedVisitors.push(visitor.id);
      currentCardIndex++;
    });
    
    setPages(newPages);
    setAddedVisitors(newAddedVisitors);
    setIsDialogOpen(false);
    setSelectedVisitors([]);
  }

  const removeVisitorFromCards = (visitorId) => {
    const newPages = [...pages];
    const newAddedVisitors = addedVisitors.filter(id => id !== visitorId);
    
    // Ziyaretçiyi kartlardan çıkar
    for (let pageIdx = 0; pageIdx < newPages.length; pageIdx++) {
      for (let cardIdx = 0; cardIdx < newPages[pageIdx].length; cardIdx++) {
        if (newPages[pageIdx][cardIdx].visitorId === visitorId) {
          newPages[pageIdx][cardIdx] = {
            id: newPages[pageIdx][cardIdx].id,
            name: 'İsim Soyisim',
            profession: 'Kategori',
            invitedBy: 'Davet Eden',
            isEmpty: true
          };
          break;
        }
      }
    }
    
    // Boş sayfaları kaldır (ilk sayfa hariç)
    while (newPages.length > 1 && newPages[newPages.length - 1].every(card => card.isEmpty)) {
      newPages.pop();
    }
    
    setPages(newPages);
    setAddedVisitors(newAddedVisitors);
  }

  const handleAddAllVisitors = () => {
    addVisitorsToCards(allVisitors);
  }

  const handleAddSelectedVisitors = () => {
    const visitorsToAdd = allVisitors.filter(visitor => 
      selectedVisitors.includes(visitor.id)
    );
    addVisitorsToCards(visitorsToAdd);
  }

  return (
    <>
      {/* Yazdırma, Düzenle ve Döndür butonları - sadece ekranda görünür */}
      <div className="print:hidden flex justify-center flex-wrap gap-3 autoFix mb-6">
        <Button
          onClick={handlePrint}
          variant="default"
          size="default"
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          Yazdır (A4)
        </Button>
        <Button
          onClick={handleRotateToggle}
          variant={isRotated ? "default" : "outline"}
          size="default"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {isRotated ? 'Döndürmeyi Kaldır' : 'Döndür'}
        </Button>
        
        {/* Zoom Butonları */}
        <div className="flex gap-1">
          <Button
            onClick={handleZoomOut}
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            onClick={resetZoom}
            variant="outline"
            size="sm"
            className="min-w-[60px]"
          >
            {Math.round(zoomLevel * 100)}%
          </Button>
          <Button
            onClick={handleZoomIn}
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={zoomLevel >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Ziyaretçiler Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="default"
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Ziyaretçiler
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Ziyaretçiler - Kartvizit Seçimi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Kartvizitlere eklemek istediğiniz ziyaretçileri seçin (maksimum 9 ziyaretçi)
                </p>
                <Button
                  onClick={handleSelectAllVisitors}
                  variant="outline"
                  size="sm"
                >
                  {selectedVisitors.length === allVisitors.filter(v => !addedVisitors.includes(v.id)).length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-75 overflow-y-auto">
                {allVisitors.map((visitor) => {
                  const isAdded = addedVisitors.includes(visitor.id);
                  const isSelected = selectedVisitors.includes(visitor.id);
                  return (
                    <div key={visitor.id} className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 ${isAdded ? 'bg-green-50 border-green-200' : ''}`}>
                      <Checkbox
                        checked={isAdded || isSelected}
                        onCheckedChange={(checked) => handleVisitorSelection(visitor.id, checked)}
                        disabled={isAdded}
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {visitor.full_name}
                          {isAdded && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Eklendi</span>}
                        </div>
                        <div className="text-sm text-gray-500">
                          {visitor.category || 'Kategori belirtilmemiş'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {visitor.email}
                        </div>
                        {visitor.invited_by_full_name && (
                          <div className="text-xs text-blue-600 mt-1">
                            Davet Eden: {visitor.invited_by_full_name}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                >
                  İptal
                </Button>
                {/* <Button
                  onClick={handleAddAllVisitors}
                  variant="secondary"
                  disabled={allVisitors.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tüm Ziyaretçileri Ekle
                </Button> */}
                <Button
                  onClick={handleAddSelectedVisitors}
                  disabled={selectedVisitors.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Seçilenleri Ekle ({selectedVisitors.length})
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {!isEditing ? (
          <Button
            onClick={handleEditToggle}
            variant="outline"
            size="default"
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Düzenle
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="default"
              size="default"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Kaydet
            </Button>
            {/* <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              size="default"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              İptal
            </Button> */}
          </div>
        )}
      </div>

      {/* A4 Sayfalar Konteyner */}
      <div className="flex flex-col gap-0 max-lg:w-max">
        {pages.map((pageCards, pageIndex) => (
          <div key={pageIndex} className="flex justify-center">
            <div className={`a4-page ${isRotated ? '-rotate-90' : ''}`}>
            <div className='absolute top-0 left-0 w-full h-full'>
                <div className='relative w-full h-full'>
                  <div className='absolute top-[50%] left-0 translate-y-[-50%] w-[25mm] h-1 bg-black'></div>
                  <div className='absolute top-[50%] right-0 translate-y-[-50%] w-[25mm] h-1 bg-black'></div>
                  <div className='absolute top-[0] left-[50%] translate-x-[-50%] h-[25mm] w-1 bg-black'></div>
                  <div className='absolute bottom-[0] left-[50%] translate-x-[-50%] h-[25mm] w-1 bg-black'></div>
                </div>
              </div>
              <div className='a4-content autoFix'>
                {/* Sayfa içeriği */}
                <div className='pl-[20px] pr-[20px] autoFix h-full flex justify-center items-center'>
                  {/* 3x3 BNI Kartvizit Grid */}
                  <div 
                    className="flex flex-wrap p-2 gap-0.5 rotate-90 autoFix min-w-[255mm] min-h-[160mm] autoFix"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    {pageCards.map((card, cardIndex) => (
                      <div key={card.id} className="relative bg-white border-1 border-black overflow-hidden w-[33%] autoFix">
                        {/* Üst bölüm - Beyaz alan */}
                        <div className="bg-white h-full p-3 flex flex-col justify-between relative autoFix">
                          {/* BNI Logo */}
                          <div className="flex">
                            <img 
                              src={bniLogo} 
                              alt="BNI Logo" 
                              className="h-6 w-auto"
                            />
                          </div>
                          <div className='flex-grow flex justify-center items-center relative z-10'>
                              <div className='flex flex-col items-center justify-center gap-6 w-full'>
                                  {card.isEmpty && !isEditing ? (
                                    // Boş kart görünümü
                                    <div className='flex flex-col items-center justify-center gap-6 w-full'>
                                      <div className='font-bold text-3xl'>{card.name}</div>
                                      <div className='font-bold text-xl'>{card.profession}</div>
                                      <div className='font-bold text-sm text-[#C80F2E] w-full'>Davet Eden: <span className='text-black'>{card.invitedBy}</span></div>
                                    </div>
                                  ) : isEditing ? (
                                    <>
                                      <input
                                        type="text"
                                        value={card.name}
                                        onChange={(e) => handleCardUpdate(pageIndex, cardIndex, 'name', e.target.value)}
                                        className='font-bold text-xl text-center bg-yellow-100 border border-yellow-300 rounded px-2 py-1 w-full'
                                        placeholder="İsim Soyisim"
                                      />
                                      <input
                                        type="text"
                                        value={card.profession}
                                        onChange={(e) => handleCardUpdate(pageIndex, cardIndex, 'profession', e.target.value)}
                                        className='font-bold text-md text-center bg-yellow-100 border border-yellow-300 rounded px-2 py-1 w-full'
                                        placeholder="Kategori"
                                      />
                                      <input
                                        type="text"
                                        value={card.invitedBy}
                                        onChange={(e) => handleCardUpdate(pageIndex, cardIndex, 'invitedBy', e.target.value)}
                                        className='font-bold text-xl text-[#C80F2E] text-center bg-yellow-100 border border-yellow-300 rounded px-2 py-1 w-full'
                                        placeholder="Davet Eden"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <div className='font-bold text-3xl'>{card.name}</div>
                                      <div className='font-bold text-xl'>{card.profession}</div>
                                      <div className='font-bold text-sm text-[#C80F2E] w-full'>
                                        Davet Eden: <span className='text-black'>{card.invitedBy}</span>
                                      </div>
                                    </>
                                  )}
                              </div>
                          </div>
                        </div>
                        <img src={uyeKartAlt} alt="Uye Kart Alt" className='absolute bottom-0 right-0 w-[50%] h-auto object-cover' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PagePrint6;