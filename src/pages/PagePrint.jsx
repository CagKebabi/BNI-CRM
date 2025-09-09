import React, { useState, useEffect } from 'react';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import { groupMembersService } from '../services/groupMembers.service';
import { eventsService } from '../services/events.service';
import { visitsService } from '../services/visits.service';
import { groupsStaticDatasService } from '../services/groupsStaticDatas.service';
import { groupMeetingsService } from '../services/groupMeetings.service';
import { presentationsService } from '../services/presentations.service';
import './PagePrint.css';
import { useGroup } from '../contexts/GroupContext';

const PagePrint = () => {  
  const { selectedGroupContext } = useGroup();
  const [goldMembers, setGoldMembers] = useState([]);
  const [leaderMembers, setLeaderMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groupsStaticDatas, setGroupsStaticDatas] = useState([]);
  const [groupMeetings, setGroupMeetings] = useState([]);
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    fetchGoldMembers();
    fetchLeaderMembers();
    fetchEvents();
    fethVisitors(); // Bu fonksiyon içinde groupMeetings de çekiliyor
    fetchGroupsStaticDatas();
    fetchPresentations();
    console.log("selectedGroupContext", selectedGroupContext);
    console.log("goldMembers", goldMembers);
    console.log("leaderMembers", leaderMembers);
    console.log("events", events);
    console.log("visitors", visitors);
    console.log("groupsStaticDatas", groupsStaticDatas);
    console.log("groupMeetings", groupMeetings);
    console.log("presentations", presentations);
  }, []);

  const fetchGoldMembers = async () => {
    const goldMembers = await groupMembersService.getGroupGoldMembers(selectedGroupContext?.id);
    setGoldMembers(goldMembers);
  }

  const fetchLeaderMembers = async () => {
    const leaderMembers = await groupMembersService.getGroupLeaderTeam(selectedGroupContext?.id);
    setLeaderMembers(leaderMembers);
  }

  const fetchEvents = async () => {
    const events = await eventsService.getEvents(selectedGroupContext?.id);
    
    // Güncel tarihi al
    const currentDate = new Date();
    
    // Gelecek etkinlikleri filtrele ve tarihe göre sırala
    const futureEvents = events
      .filter(event => new Date(event.date) >= currentDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (futureEvents.length > 0) {
      // En yakın tarihi bul
      const nearestDate = new Date(futureEvents[0].date);
      
      // Aynı tarihte olan tüm etkinlikleri filtrele
      const eventsOnNearestDate = futureEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === nearestDate.getFullYear() &&
               eventDate.getMonth() === nearestDate.getMonth() &&
               eventDate.getDate() === nearestDate.getDate();
      });
      
      setEvents(eventsOnNearestDate);
    } else {
      setEvents([]);
    }
  }

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

  const fetchGroupsStaticDatas = async () => {
    if (!selectedGroupContext?.id) return;
    try {
      const response = await groupsStaticDatasService.getGroupsStaticDatas(selectedGroupContext.id);
      setGroupsStaticDatas(response);
      console.log("Grup statik verileri alındı:", response);
    }
    catch (error) {
      console.error("Grup statik verileri alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPresentations = async () => {
    if (!selectedGroupContext?.id) return;

    setIsLoading(true);
    try {
      const response = await presentationsService.getPresentations(
        selectedGroupContext.id
      );
      console.log("Sunumlar alındı:", response);
      setPresentations(response);
    } catch (error) {
      console.error("Sunumlar alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // fetchGroupMeetings fonksiyonu kaldırıldı - artık fethVisitors içinde çağırılıyor

  const handlePrint = () => {
    // PDF adını dinamik olarak ayarla
    const originalTitle = document.title;
    const currentDate = new Date().toLocaleDateString('tr-TR').replace(/\./g, '-');
    document.title = `BNI_${selectedGroupContext?.name || 'Grup'}_Toplanti_Agendassi_${currentDate}`;
    
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
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          Yazdır (A4)
        </button>
      </div>

      {/* A4 Sayfalar Konteyner */}
      <div className="flex flex-col gap-0">
        {/* Birinci Sayfa */}
        <div className="flex justify-center">
          <div className="a4-page">
            <div className='a4-content pb-[50px] autoFix'>
              {/* Birinci sayfa içeriği */}
              <div className='text-[12px] gap-2 font-bold h-[63px] pl-[20px] pr-[20px] flex items-center autoFix'>
                <img className='w-[90px]' src={bniLogo} alt="" />
                <div className='flex items-start flex-col flex-grow'>
                  <h2 className=' font-bold text-xl text-[#C80F2E]'>
                    {`${selectedGroupContext?.name} GRUP TOPLANTISI`}
                  </h2>
                  <p className='text-xs font-light text-[#C80F2E]'>
                    Türkiye'nin İş Yapış Biçimini Değiştiriyoruz
                  </p>
                  <div className='w-full h-[1px] bg-[#000000]'></div>
                </div>
              </div>
              <div className='pl-[20px] pr-[20px] autoFix'>
                <div className='font-bold text-xl'>{`BNI ${selectedGroupContext?.name} Her ${selectedGroupContext?.meeting_day} - ${selectedGroupContext?.start_time} - ${selectedGroupContext?.end_time} Arası`}</div>
                <div className='text-xs font-light text-[#000000] text-end'>www.bni.com.tr</div>
                <div className='w-full h-[1px] bg-[#000000]'></div>
              </div>
              <div className='flex pl-[20px] pr-[20px] autoFix'>
                <div className='w-2.5/10'>
                  <div>
                    <div className='font-bold text-center text-md p-[7px] bg-[#F3F3F3] mt-[15px] w-full autoFix'>{`RAKAMLARLA ${selectedGroupContext?.name.toUpperCase()}`}</div>
                    <div>
                      <div className='font-bold text-sm text-center'>{(() => {
                        const today = new Date();
                        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                        return firstDayOfMonth.toLocaleDateString('tr-TR');
                      })()} <span className='font-light text-sm'>Tarihi İtibariyle</span></div>
                    </div>
                  </div>
                  <div className='flex flex-col items-center gap-2 mt-[20px] autoFix'>
                    <div className='font-bold text-md'>Yönlendirme</div>
                    <div className='font-bold text-5xl text-[#C80F2E]'>{groupsStaticDatas.find(data => data.key === "is_yonlendirmesi")?.value}</div>
                  </div>
                  <div className='flex flex-col items-center gap-2 mt-[20px] autoFix'>
                    <div className='font-bold text-md'>Ciro</div>
                    <div className='font-bold text-2xl text-[#C80F2E]'>₺{groupsStaticDatas.find(data => data.key === "ciro")?.value}</div>
                  </div>
                  <div className='flex flex-col items-center gap-2 mt-[20px] autoFix'>
                    <div className='font-bold text-md'>1'E 1</div>
                    <div className='font-bold text-5xl text-[#C80F2E] autoFix'>{groupsStaticDatas.find(data => data.key === "bir_e_bir")?.value}</div>
                  </div>
                  <div className='flex flex-col items-center gap-2 mt-[20px] autoFix'>
                    <div className='font-bold text-md'>Ziyaretçi</div>
                    <div className='font-bold text-5xl text-[#C80F2E] autoFix'>{groupsStaticDatas.find(data => data.key === "ziyaretci")?.value}</div>
                  </div>
                  <div className='font-bold text-center text-md p-[7px] bg-[#F3F3F3] mt-[15px] w-full autoFix'>{(() => {
                    const previousMonth = new Date();
                    previousMonth.setMonth(previousMonth.getMonth() - 1);
                    return previousMonth.toLocaleString('tr-TR', { month: 'long' }).toUpperCase();
                  })()} AYI</div>
                  <div className='font-bold text-center text-md p-[7px] bg-[#F3F3F3] w-full autoFix'>NETWORK LİDERLERİ</div>
                  <div className='flex flex-col items-center'>
                    <div className='flex flex-col items-center'>
                      <div className='font-bold text-center text-md p-[7px] pb-0 w-full autoFix'>iŞ YÖNLENDİRME</div>
                      <div className='text-center text-sm w-full autoFix'>{groupsStaticDatas.find(data => data.key === "en_cok_is_yonlendiren")?.description}</div>
                    </div>
                    <div className='font-bold text-5xl text-[#C80F2E] p-[25px] autoFix'>{groupsStaticDatas.find(data => data.key === "en_cok_is_yonlendiren")?.value}</div>
                  </div>
                  <div className='flex flex-col items-center'>
                    <div className='flex flex-col items-center'>
                      <div className='font-bold text-center text-md w-full autoFix'>ZİYARETÇİ DAVETİ</div>
                      <div className='text-center text-sm w-full autoFix'>{groupsStaticDatas.find(data => data.key === "en_cok_ziyaretci_davet_eden")?.description}</div>
                    </div>
                    <div className='font-bold text-5xl text-[#C80F2E] p-[25px] autoFix'>{groupsStaticDatas.find(data => data.key === "en_cok_ziyaretci_davet_eden")?.value}</div>
                  </div>
                  <div className='flex flex-col items-center'>
                    <div className='flex flex-col items-center'>
                      <div className='font-bold text-center text-md w-full autoFix'>CİRO</div>
                      <div className='text-center text-sm w-full autoFix'>{groupsStaticDatas.find(data => data.key === "en_cok_ciro_yapan")?.description}</div>
                    </div>
                    <div className='font-bold text-2xl text-[#C80F2E] p-[20px] autoFix'>₺{groupsStaticDatas.find(data => data.key === "en_cok_ciro_yapan")?.value}</div>
                  </div>
                </div>
                <div className='w-[1px] h-auto bg-[#000000]'></div>
                <div className='flex flex-col w-5/10'>
                  <div className='text-center font-bold text-2xl text-[#C80F2E] p-[20px] autoFix'>21.08.2025</div>
                  <ul className='flex flex-col items-center gap-2'>
                    <li className='text-xl'>Serbest Networking</li>
                    <li className='text-xl'>BNI,Felsefesi ve Temel Değerlerimiz</li>
                    <li className='text-xl'>Lider Ekip Tanıtımı</li>
                    <li className='text-xl'>Networking Eğitimi</li>
                    <li className='text-xl'>Üyelerimizin Haftalık Sunumları </li>
                    <li className='text-xl'>Ziyaretçi Sunumları (30 Saniye)</li>
                  </ul>
                  <div className='flex flex-col items-center gap-3 p-[10px] mt-[10px] bg-[#D11C2F] autoFix'>
                    <div className='text-xl text-white font-bold'>Genişletilmiş Sunum</div>
                    {(() => {
                      // Bugüne en yakın presentation'ı bul
                      const currentDate = new Date();
                      const futureOrTodayPresentations = presentations
                        .filter(presentation => new Date(presentation.meeting_date) >= currentDate)
                        .sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date));
                      
                      const nearestPresentation = futureOrTodayPresentations[0];
                      
                      return nearestPresentation ? (
                        <>
                          <div className='text-xl text-white font-bold'>{nearestPresentation.user_full_name}</div>
                          <div className='text-xl text-white font-bold'>{nearestPresentation.category || 'Üye Kategorisi Belirtilmemiş'}</div>
                        </>
                      ) : (
                        <>
                          <div className='text-xl text-white font-bold'>-</div>
                          <div className='text-xl text-white font-bold'>-</div>
                        </>
                      );
                    })()}
                  </div>
                  <div className='flex flex-col items-center gap-2 mt-[10px] autoFix'>
                    <div className='text-xl'>Katkı Anonsları</div>
                    <div className='text-xl'>Grubun Başarıları</div>
                  </div>
                  <div className='flex flex-col gap-2 mt-[10px] autoFix'>
                    <div className='text-xl text-[#D11C2F] font-bold underline text-center'>Yaklaşan Etkinlikler</div>
                    
                    {events.map((event) => (
                      <div className='text-sm font-bold flex justify-between'>
                        <div className='w-2/3'>{event.title}</div>
                        <div>{new Date(event.date).toLocaleDateString('tr-TR')}</div>
                      </div>
                    ))}
                  </div>
                  <div className='text-xl text-center mt-[15px] autoFix'>Kapanış</div>
                  <div className='flex flex-col flex-grow justify-between gap-2 mt-[10px] autoFix'>
                    <div className='text-xl text-[#D11C2F] font-bold underline text-center mt-[25px] autoFix'>Haftanın Alıntısı</div>
                    <div className='text-center pl-[25px] pr-[25px] autoFix'>{groupsStaticDatas.find(data => data.key === "haftanin_alintisi")?.value}</div>
                    <div className='text-end pr-[15px] autoFix'></div>
                  </div>
                </div>
                <div className='w-[1px] h-auto bg-[#000000]'></div>
                <div className='w-2.5/10'>
                  <div className='font-bold text-center text-md p-[7px] bg-[#F3F3F3] mt-[15px] w-full autoFix'>LİDER EKİP ÜYELERİMİZ</div>
                  <ul className='flex flex-col gap-2 mt-[20px] pl-[3px] autoFix'>
                    {
                      leaderMembers.map((member) => (
                        <li className='flex flex-col gap-1'>
                          <div className='text-xs text-[#D11C2F] font-bold'>{member.roles.map((role) => role).join(", ")}</div>
                          <div className='text-sm'>{member.first_name} {member.last_name}</div>
                        </li>
                      ))
                    }
                  </ul>
                  <div className='text-sm font-bold text-center bg-[#D11C2F] text-white mt-[15px] py-[10px] autoFix'>Gold Members</div>
                  <ul className='flex flex-col gap-1 pl-[3px] text-xs font-bold mt-[10px] autoFix'>
                    {
                      goldMembers.map((member) => (
                        <li>{member.first_name} {member.last_name}</li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İkinci Sayfa */}
        <div className="flex justify-center">
          <div className="a4-page">
            <div className='a4-content pb-[50px] autoFix'>
              {/* İkinci sayfa içeriği */}
              <div className='pl-[20px] pr-[20px] autoFix'>
                <div className='text-[12px] gap-2 font-bold h-[63px] flex items-center autoFix'>
                  <img className='w-[90px]' src={bniLogo} alt="" />
                  <div>
                    <div className='flex items-start flex-col flex-grow'>
                        <div className='text-sm font-bold'>Türkiye/İstanbul</div>
                        <div className='text-sm font-bold'>{`BNI ${selectedGroupContext?.name} Her ${selectedGroupContext?.meeting_day} - ${selectedGroupContext?.start_time} - ${selectedGroupContext?.end_time} Arası`}</div>
                    </div>
                  </div>
                </div>
                <div>
                    <table className="w-full border-collapse mt-4">
                        <thead>
                            <tr>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Sıra</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi Adı Soyadı</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi Kategori</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi Firma</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi GSM</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi E-mail</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Davet Eden Üye</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.length > 0 ? (
                                visitors.map((visitor, index) => (
                                    <tr key={visitor.id} className={index % 2 === 0 ? "bg-black/20" : "bg-white"}>
                                        <td className="border border-black/70 p-2 text-xs text-center autoFix">{index + 1}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.full_name}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.category}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.company}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.phone}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.email}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.invited_by_full_name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border border-gray-300 p-2 text-sm text-center" colSpan="7">
                                        {isLoading ? 'Ziyaretçiler yükleniyor...' : 'Henüz ziyaretçi kaydı bulunmamaktadır.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PagePrint;