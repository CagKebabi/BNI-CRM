import React, { useState, useEffect } from 'react';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import { visitsService } from '../services/visits.service';
import { groupMeetingsService } from '../services/groupMeetings.service';
import './PagePrint.css';
import { useGroup } from '../contexts/GroupContext';
import { Printer } from 'lucide-react';
import { Button } from '../components/ui/button';

const PagePrint4 = () => {  
  const { selectedGroupContext } = useGroup();
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nearestMeeting, setNearestMeeting] = useState(null);

  useEffect(() => {
    fethVisitors();
    findNearestMeeting();
    console.log("selectedGroupContext", selectedGroupContext);
    console.log("visitors", visitors);
  }, []);

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

  // Bugüne en yakın meeting'i bulan fonksiyon
  const findNearestMeeting = async () => {
    const meetings = await groupMeetingsService.getGroupMeetings(selectedGroupContext.id);
    if (!meetings || meetings.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Saati sıfırla
    
    // Toplantıları tarihe göre sırala (bugüne en yakından başlayarak)
    const sortedMeetings = meetings
      .map(meeting => ({
        ...meeting,
        dateObj: new Date(meeting.date)
      }))
      .sort((a, b) => {
        const diffA = Math.abs(a.dateObj - today);
        const diffB = Math.abs(b.dateObj - today);
        return diffA - diffB;
      });
    
    setNearestMeeting(sortedMeetings.length > 0 ? sortedMeetings[0] : null);
  };

  const handlePrint = () => {
    // PDF adını dinamik olarak ayarla
    const originalTitle = document.title;
    const currentDate = new Date().toLocaleDateString('tr-TR').replace(/\./g, '-');
    document.title = `BNI_${selectedGroupContext?.name || 'Grup'}_Ziyaretci_Yoklama_${currentDate}`;
    
    window.print();
    
    // Yazdırma işlemi tamamlandıktan sonra orijinal title'ı geri yükle
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }

  return (
    <>
      {/* Yazdırma butonu - sadece ekranda görünür */}
      <div className="print:hidden flex justify-center autoFix">
        <Button
          onClick={handlePrint}
          variant="default"
          size="default"
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          Yazdır (A4)
        </Button>
      </div>

      {/* A4 Sayfalar Konteyner */}
      <div className="flex flex-col gap-0">
        {/* İkinci Sayfa */}
        <div className="flex justify-center">
          <div className="a4-page">
            <div className='a4-content pb-[50px] autoFix'>
              {/* İkinci sayfa içeriği */}
              <div className='pl-[20px] pr-[20px] autoFix h-full'>
                <div className='text-[12px] gap-2 font-bold h-[63px] flex items-center justify-between autoFix'>
                  <div className='flex items-center gap-2'>
                    <img className='w-[90px]' src={bniLogo} alt="" />
                    <div>
                      <div className='flex items-start flex-col flex-grow'>
                          <div className='text-sm font-bold'>Türkiye/İstanbul</div>
                          <div className='text-sm font-bold'>{`BNI ${selectedGroupContext?.name} Her ${selectedGroupContext?.meeting_day} - ${selectedGroupContext?.start_time} - ${selectedGroupContext?.end_time} Arası`}</div>
                      </div>
                    </div>
                  </div>
                  <div className='text-sm font-bold'>
                    {nearestMeeting?.date ? new Date(nearestMeeting.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : ''}
                  </div>
                </div>
                <div className='flex flex-col h-full'>
                    <div className='text-xs font-bold text-[#C80F2E] text-center'>
                      {`BNI ${selectedGroupContext?.name.toUpperCase()} ZİYARETÇİ YOKLAMA LİSTESİ`}
                    </div>
                    <table className="w-full border-collapse mt-3 autoFix">
                    <thead>
                      <tr>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Sıra</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Ziyaretçi Ad Soyad</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Ziyaretçi Kategori</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Ziyaretçi Firma</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Davet Eden Üye</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">İmza</th>
                      </tr>
                    </thead>
                    <tbody className='text-[9px]'>
                      {visitors?.map((visitor, index) => (
                        <tr key={visitor.id} className={index % 2 === 0 ? "bg-white" : "bg-black/20"}>
                          <td className="p-1 border border-black/70 autoFix font-bold text-center">{index + 1}</td>
                          <td className="p-1 border border-black/70 autoFix">{visitor.full_name}</td>
                          <td className='p-1 border border-black/70 autoFix'>{visitor.category}</td>
                          <td className='p-1 border border-black/70 autoFix'>{visitor.company}</td>
                          <td className='p-1 border border-black/70 autoFix'>{visitor.invited_by_full_name}</td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                        </tr>
                      )) || []}
                      {/* Boş satırlar ekleyerek 45 satıra tamamla */}
                      {Array.from({ 
                        length: Math.max(0, 35 - (visitors?.length || 0)) 
                      }).map((_, index) => (
                        <tr key={`empty-main-${index}`} className={((visitors?.length || 0) + index) % 2 === 0 ? "bg-white" : "bg-black/20"}>
                          <td className="p-1 border border-black/70 autoFix font-bold text-center">{(visitors?.length || 0) + index + 1}</td>
                          <td className="p-1 border border-black/70 autoFix"></td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                    <div className='flex-grow flex items-center justify-center'>
                        <p className='mt-4 border border-black/70 p-2 text-[10px] autoFix'>
                        Yukarıda atmış bulunduğum imza ile, işbu faaliyet çerçevesinde BNI tarafından elde edilen tarafıma ait kişisel bilgilerin BNI sistemine girilmesine muvafakat
                        ettiğimi, yine işbu toplantı ve sair faaliyetler süresince BNI, BNI Üyeleri ile toplantıda bulunan diğer kişiler tarafından kaydedilen videolar ile çekilen fotoğrafların
                        bilgim dahilinde olduğunu, bu video ve fotoğrafların Facebook, Twitter, Youtube gibi tüm sosyal medya araçları ile sair her türlü yazılı, görsel, işitsel ortamda
                        BNI, BNI Üyleleri ve toplantıda bulunan diğer kişiler tarafından paylaşılmasına muvafakatim olduğunu kabul, beyan ve tahhüt ederim.
                        </p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PagePrint4;