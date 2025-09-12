import React, { useState, useEffect } from 'react';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import uyeKartAlt from '../assets/uye_kart_alt.jpg';
import { Button } from '../components/ui/button';
import { Printer, Edit, RotateCcw, Save, X } from 'lucide-react';
import { visitsService } from '../services/visits.service';
import { groupMeetingsService } from '../services/groupMeetings.service';
import './PagePrint.css';
import { useGroup } from '../contexts/GroupContext';

const PagePrint6 = () => {  
  const { selectedGroupContext } = useGroup();
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [editableCardData, setEditableCardData] = useState([]);

  useEffect(() => {
    fethVisitors();
  }, [selectedGroupContext]);

  useEffect(() => {
    // Visitors verisi değiştiğinde editable card data'yı güncelle
    const cardData = createCardDataFromVisitors(visitors);
    setEditableCardData(cardData);
  }, [visitors]);

  const createCardDataFromVisitors = (visitorsData) => {
    // 9 kartlık array oluştur
    const cards = Array.from({ length: 9 }, (_, index) => {
      const visitor = visitorsData[index];
      
      if (visitor) {
        return {
          id: visitor.id,
          name: visitor.full_name || 'İsim Soyisim',
          profession: visitor.category || 'Kategori',
          invitedBy: visitor.invited_by_full_name || 'Davet Eden',
          isEmpty: false
        };
      } else {
        return {
          id: `empty-${index}`,
          name: '',
          profession: '',
          invitedBy: '',
          isEmpty: true
        };
      }
    });
    
    return cards;
  };

  const fethVisitors = async () => {
    setIsLoading(true);
    try {
      const [visitorsResponse, meetingsResponse] = await Promise.all([
        visitsService.getVisits(selectedGroupContext.id),
        groupMeetingsService.getGroupMeetings(selectedGroupContext.id)
      ]);
      
      console.log("Ziyaretçiler alındı:", visitorsResponse);
      console.log("Toplantılar alındı:", meetingsResponse);
      
      // Bugüne en yakın toplantıyı bul
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
        
        // Sadece en yakın toplantı tarihindeki ziyaretçileri filtrele
        const filteredVisitors = visitorsResponse.filter(visitor => 
          visitor.meeting === nearestMeeting.id
        );
        
        console.log("Filtrelenmiş ziyaretçiler:", filteredVisitors);
        setVisitors(filteredVisitors);
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
    document.title = `BNI_${selectedGroupContext?.name || 'Grup'}_Uye_Kartı`;
    
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

  const handleCardUpdate = (cardIndex, field, value) => {
    setEditableCardData(prevData => 
      prevData.map((card, index) => 
        index === cardIndex 
          ? { ...card, [field]: value }
          : card
      )
    );
  }

  const handleSave = () => {
    setIsEditing(false);
    // Burada verileri backend'e kaydetme işlemi yapılabilir
    console.log('Kart verileri kaydedildi:', editableCardData);
  }

  return (
    <>
      {/* Yazdırma, Düzenle ve Döndür butonları - sadece ekranda görünür */}
      <div className="print:hidden flex justify-center gap-3 autoFix mb-6">
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
      <div className="flex flex-col gap-0">
        {/* Birinci Sayfa */}
        <div className="flex justify-center">
          <div className={`a4-page ${isRotated ? '-rotate-90' : ''}`}>
            <div className='a4-content autoFix'>
              {/* İkinci sayfa içeriği */}
              <div className='pl-[20px] pr-[20px] autoFix h-full flex justify-center items-center'>
                {/* 3x3 BNI Kartvizit Grid */}
                <div className="flex flex-wrap p-2 gap-0.5 rotate-90 autoFix min-w-[290mm] min-h-[200mm] autoFix">
                  {editableCardData.map((card, index) => (
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
                                      onChange={(e) => handleCardUpdate(index, 'name', e.target.value)}
                                      className='font-bold text-xl text-center bg-yellow-100 border border-yellow-300 rounded px-2 py-1 w-full'
                                      placeholder="İsim Soyisim"
                                    />
                                    <input
                                      type="text"
                                      value={card.profession}
                                      onChange={(e) => handleCardUpdate(index, 'profession', e.target.value)}
                                      className='font-bold text-md text-center bg-yellow-100 border border-yellow-300 rounded px-2 py-1 w-full'
                                      placeholder="Kategori"
                                    />
                                    <input
                                      type="text"
                                      value={card.invitedBy}
                                      onChange={(e) => handleCardUpdate(index, 'invitedBy', e.target.value)}
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
      </div>
    </>
  );
};

export default PagePrint6;