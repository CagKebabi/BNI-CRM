import React, { useState, useEffect } from 'react';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import { groupMembersService } from '../services/groupMembers.service';
import { eventsService } from '../services/events.service';
import { groupsStaticDatasService } from '../services/groupsStaticDatas.service';
import { presentationsService } from '../services/presentations.service';
import { openCategoriesService } from '../services/openCategories.service';
import { groupMeetingsService } from '../services/groupMeetings.service';
import { Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import './PagePrint.css';
import { useGroup } from '../contexts/GroupContext';

const PagePrint = () => {  
  const { selectedGroupContext } = useGroup();
  const [goldMembers, setGoldMembers] = useState([]);
  const [leaderMembers, setLeaderMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groupsStaticDatas, setGroupsStaticDatas] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [openCategories, setOpenCategories] = useState([]);
  const [visitorCommitteeMembers, setVisitorCommitteeMembers] = useState([]);
  const [membershipCommitteeMembers, setMembershipCommitteeMembers] = useState([]);
  const [groupAmbassadors, setGroupAmbassadors] = useState([]); 
  const [consultingDirectors, setConsultingDirectors] = useState([]);
  const [nearestMeeting, setNearestMeeting] = useState(null);

  useEffect(() => {
    fetchGoldMembers();
    fetchLeaderMembers();
    fetchEvents();
    fetchGroupsStaticDatas();
    fetchPresentations();
    fetchOpenCategories();
    filterVisitorCommitteeMembers();
    filterMembershipCommitteeMembers();
    filterGroupAmbassadors();
    filterConsultingDirectors();
    findNearestMeeting();
    console.log("selectedGroupContext", selectedGroupContext);
    console.log("goldMembers", goldMembers);
    console.log("leaderMembers", leaderMembers);
    console.log("events", events);
    console.log("groupsStaticDatas", groupsStaticDatas);
    console.log("presentations", presentations);
    console.log("openCategories", openCategories);
    console.log("visitorCommitteeMembers", visitorCommitteeMembers);
    console.log("membershipCommitteeMembers", membershipCommitteeMembers);
    console.log("groupAmbassadors", groupAmbassadors);
    console.log("consultingDirectors", consultingDirectors);
    console.log("nearestMeeting", nearestMeeting);
  }, [selectedGroupContext]);

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
      
      // Bugünün tarihini al
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Saati sıfırla
      
      // Gelecekteki sunumları filtrele ve tarihe göre sırala
      const upcomingPresentations = response
        .filter(presentation => {
          const presentationDate = new Date(presentation.meeting_date);
          presentationDate.setHours(0, 0, 0, 0);
          return presentationDate >= today;
        })
        .sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date))
        .slice(0, 6); // En yakın 6 sunumu al (sunum rotasyonu için)
      
      setPresentations(upcomingPresentations);
    } catch (error) {
      console.error("Sunumlar alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOpenCategories = async () => {
    if (!selectedGroupContext?.id) return;

    setIsLoading(true);
    try {
      const response = await openCategoriesService.getOpenCategories(
        selectedGroupContext.id
      );
      console.log("Açık kategoriler alındı:", response);
      setOpenCategories(response);
    } catch (error) {
      console.error("Açık kategoriler alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVisitorCommitteeMembers = () => {
    if (!selectedGroupContext?.users) return;

    const visitorMembers = selectedGroupContext.users.filter(user => 
      user.roles && user.roles.some(role => role.category === 'Ziyaretçi Komitesi')
    );

    console.log("Ziyaretçi Komitesi üyeleri filtrelendi:", visitorMembers);
    setVisitorCommitteeMembers(visitorMembers);
  };

  const filterMembershipCommitteeMembers = () => {
    if (!selectedGroupContext?.users) return;

    const membershipMembers = selectedGroupContext.users.filter(user => 
      user.roles && user.roles.some(role => role.category === 'Üyelik Komitesi')
    );

    console.log("Üyelik Komitesi üyeleri filtrelendi:", membershipMembers);
    setMembershipCommitteeMembers(membershipMembers);
  };

  const filterGroupAmbassadors = () => {
    if (!selectedGroupContext?.users) return;
    const groupAmbassadors = selectedGroupContext.users.filter(user => 
      user.roles && user.roles.some(role => role.role === 'BNI Elçisi')
    );
    setGroupAmbassadors(groupAmbassadors);
  }

  const filterConsultingDirectors = () => {
    if (!selectedGroupContext?.users) return;
    const consultingDirectors = selectedGroupContext.users.filter(user => 
      user.roles && user.roles.some(role => role.role === 'Danışman Direktör')
    );
    setConsultingDirectors(consultingDirectors);
  }

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
      <div className="flex flex-col gap-0 max-lg:w-max">
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
                  <div className='text-center font-bold text-2xl text-[#C80F2E] p-[20px] autoFix'>
                    {nearestMeeting?.date ? new Date(nearestMeeting.date).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : ''}
                  </div>
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
                <div className='flex'>
                  <div className='w-4/10'>
                    <div className="border border-black/70 border-r-0">
                      <div className="bg-black/20 border-b border-black/70 text-[11px] text-center text-[#C80F2E] font-bold p-0.5">
                        LİDER EKİP
                      </div>
                      <div className='text-[10px]'>
                        {leaderMembers.map((member, index) => (
                          <div key={member.id} className="flex border-b border-black/70 last:border-b-0">
                            <div className="w-1/2 p-0.5 font-bold border-r border-black/70">
                              {member.roles && member.roles.length > 0 ? member.roles[0] : 'Rol Belirtilmemiş'}
                            </div>
                            <div className="w-1/2">
                              {member.first_name} {member.last_name}
                            </div>
                          </div>
                        ))}
                        {/* Boş satırlar ekleyerek 12 satıra tamamla */}
                        {Array.from({ length: Math.max(0, 12 - leaderMembers.length) }).map((_, index) => (
                          <div key={`empty-leader-${index}`} className="flex border-b border-black/70 last:border-b-0">
                            <div className="w-1/2 p-1 font-bold border-r border-black/70">&nbsp;</div>
                            <div className="w-1/2 p-1">&nbsp;</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='flex-grow'>
                    <div className='flex'>
                      <div className='w-[40%]'>
                        <div className="border border-black/70 border-r-0 border-b-0">
                          <div className="bg-black/20 border-b border-black/70 text-[11px] text-center text-[#C80F2E] font-bold p-0.5">
                            Üyelik Komitesi
                          </div>
                          <ul className='text-[10px] m-0 p-0 list-none'>
                            {membershipCommitteeMembers.length > 0 ? (
                              membershipCommitteeMembers.map((member, index) => (
                                <li key={member.id} className="border-b border-black/70 p-0.5 last:border-b-0">
                                  {member.first_name} {member.last_name}
                                </li>
                              ))
                            ) : (
                              <li className="p-2 text-center">
                                Üyelik komitesi üyesi bulunmamaktadır.
                              </li>
                            )}
                            {/* Boş satırlar ekleyerek 12 satıra tamamla */}
                            {Array.from({ 
                              length: Math.max(0, 6 - membershipCommitteeMembers.length) 
                            }).map((_, index) => (
                              <li key={`empty-membership-${index}`} className="border-b border-black/70 p-0.5 last:border-b-0">
                                &nbsp;
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className='w-[60%]'>
                        <div className="border border-black/70 border-b-0">
                          <div className="bg-black/20 border-b border-black/70 text-[11px] text-center text-[#C80F2E] font-bold p-0.5">
                            SUNUM ROTASYONU
                          </div>
                          <ul className='text-[10px] font-bold m-0 p-0 list-none'>
                            {presentations.length > 0 ? (
                              presentations.map((presentation, index) => (
                                <li key={presentation.id} className="border-b border-black/70 p-0.5 last:border-b-0">
                                  <div className='flex justify-center gap-2'>
                                    <span>
                                      {new Date(presentation.meeting_date).toLocaleDateString('tr-TR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                      })}
                                    </span>
                                    <span>{presentation.user_full_name}</span>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="p-2 text-center">
                                Sunum rotasyonu bulunmamaktadır.
                              </li>
                            )}
                            {/* Boş satırlar ekleyerek 6 satıra tamamla */}
                            {Array.from({ length: Math.max(0, 6 - presentations.length) }).map((_, index) => (
                              <li key={`empty-rotation-${index}`} className="border-b border-black/70 p-0.5 last:border-b-0">
                                <div className='flex justify-center gap-2'>
                                  <span>&nbsp;</span>
                                  <span>&nbsp;</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='w-[40%]'>
                        <div className="border border-black/70 border-r-0">
                          <div className="bg-black/20 border-b border-black/70 text-[10px] text-center text-[#C80F2E] font-bold p-0.5">
                            Ziyaretçi Komitesi
                          </div>
                          <ul className='text-[10px] m-0 p-0 list-none'>
                            {visitorCommitteeMembers.length > 0 ? (
                              visitorCommitteeMembers.map((member, index) => (
                                <li key={member.id} className="border-b border-black/70 p-0.5 last:border-b-0">
                                  {member.first_name} {member.last_name}
                                </li>
                              ))
                            ) : (
                              <li className="p-2 text-center">
                                Ziyaretçi komitesi üyesi bulunmamaktadır.
                              </li>
                            )}
                            {/* Boş satırlar ekleyerek 6 satıra tamamla */}
                            {Array.from({ 
                              length: Math.max(0, 6 - visitorCommitteeMembers.length) 
                            }).map((_, index) => (
                              <li key={`empty-visitor-${index}`} className="border-b border-black/70 p-0.5 last:border-b-0">
                                &nbsp;
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className='w-[60%]'>
                        <div className="border border-black/70">
                          <div className="bg-black/20 border-b border-black/70 text-[10px] text-center text-[#C80F2E] font-bold p-0.5">
                            AÇIK KATEGORİLER
                          </div>
                          <div className='text-[10px]'>
                            {openCategories.length > 0 ? (
                              // En fazla 10 kategori göster ve 2'şerli gruplar halinde satırlara böl
                              Array.from({ length: Math.ceil(Math.min(openCategories.length, 10) / 2) }).map((_, rowIndex) => {
                                const limitedCategories = openCategories.slice(0, 10);
                                const firstCategory = limitedCategories[rowIndex * 2];
                                const secondCategory = limitedCategories[rowIndex * 2 + 1];
                                return (
                                  <div key={`category-row-${rowIndex}`} className="flex border-b border-black/70 last:border-b-0">
                                    <div className="flex-1 p-0.5 border-r border-black/70">
                                      {firstCategory ? firstCategory.name : ''}
                                    </div>
                                    <div className="flex-1 p-0.5">
                                      {secondCategory ? secondCategory.name : ''}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-2 text-center">
                                Açık kategori bulunmamaktadır.
                              </div>
                            )}
                            {/* Boş satırlar ekleyerek 5 satıra tamamla */}
                            {Array.from({ 
                              length: Math.max(0, 6 - Math.ceil(Math.min(openCategories.length, 10) / 2)) 
                            }).map((_, index) => (
                              <div key={`empty-category-${index}`} className="flex border-b border-black/70 last:border-b-0">
                                <div className="flex-1 p-0.5 border-r border-black/70">&nbsp;</div>
                                <div className="flex-1 p-0.5">&nbsp;</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-4 autoFix flex'>
                  <div className="w-[70%] border border-black/70 border-r-0">
                    <div className="bg-black/20 border-b border-black/70 text-[10px] text-center text-[#C80F2E] font-bold p-0.5">
                      DİREKTÖR VE ELÇİ
                    </div>
                    <div className='text-[10px]'>
                      {/* Danışman Direktörler */}
                      {consultingDirectors.length > 0 ? (
                        consultingDirectors.map((director, index) => (
                          <div key={`director-${director.id}`} className={`flex ${index < consultingDirectors.length - 1 || groupAmbassadors.length > 0 ? 'border-b border-black/70' : ''}`}>
                            <div className="flex-1 p-0.5 font-bold border-r border-black/70">Grup Danışman Direktörü</div>
                            <div className="flex-1 p-0.5 border-r border-black/70">{director.first_name} {director.last_name}</div>
                            <div className="flex-1 p-0.5 border-r border-black/70">{director.email || ''}</div>
                            <div className="flex-1 p-0.5">{director.gsm || ''}</div>
                          </div>
                        ))
                      ) : null}
                      
                      {/* Grup Elçileri */}
                      {groupAmbassadors.length > 0 ? (
                        groupAmbassadors.map((ambassador, index) => (
                          <div key={`ambassador-${ambassador.id}`} className={`flex ${index < groupAmbassadors.length - 1 ? 'border-b border-black/70' : ''}`}>
                            <div className="flex-1 p-0.5 font-bold border-r border-black/70">Grup Elçisi</div>
                            <div className="flex-1 p-0.5 border-r border-black/70">{ambassador.first_name} {ambassador.last_name}</div>
                            <div className="flex-1 p-0.5 border-r border-black/70">{ambassador.email || ''}</div>
                            <div className="flex-1 p-0.5">{ambassador.gsm || ''}</div>
                          </div>
                        ))
                      ) : null}

                      {/* Eğer hiç veri yoksa boş mesaj */}
                      {consultingDirectors.length === 0 && groupAmbassadors.length === 0 && (
                        <div className="flex">
                          <div className="flex-1 p-2 text-center border-r border-black/70" colSpan="4">
                            Direktör ve elçi bilgisi bulunmamaktadır.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-[30%] border border-black/70">
                    <div className="bg-black/20 border-b border-black/70 text-[10px] text-center text-[#C80F2E] font-bold p-0.5">
                      YAKLAŞAN ETKİNLİKLER
                    </div>
                    <div className='text-[10px]'>
                      {events.length > 0 ? (
                        // Gelecekteki etkinlikleri filtrele, tarihe göre sırala ve en yakın 2'sini al
                        (() => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          
                          const upcomingEvents = events
                            .filter(event => {
                              const eventDate = new Date(event.date);
                              eventDate.setHours(0, 0, 0, 0);
                              return eventDate >= today; // Bugün ve sonrası
                            })
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .slice(0, 2); // En yakın 2 etkinlik

                          return upcomingEvents.length > 0 ? (
                            upcomingEvents.map((event, index) => (
                              <div key={event.id} className={`flex ${index < upcomingEvents.length - 1 ? 'border-b border-black/70' : ''}`}>
                                <div className="w-1/3 p-0.5 font-bold border-r border-black/70">
                                  {new Date(event.date).toLocaleDateString('tr-TR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="w-2/3 p-0.5 line-clamp-1 overflow-hidden">{event.title}</div>
                              </div>
                            ))
                          ) : (
                            <div className="flex">
                              <div className="w-full p-2 text-center">
                                Yaklaşan etkinlik bulunmamaktadır.
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="flex">
                          <div className="w-full p-2 text-center">
                            Yaklaşan etkinlik bulunmamaktadır.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <table className="w-full border-collapse mt-4 autoFix">
                    <thead>
                      <tr>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Sıra</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Ad Soyad</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Kategori</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Firma</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Gsm</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">E-Mail</th>
                      </tr>
                    </thead>
                    <tbody className='text-[9px]'>
                      {selectedGroupContext?.users?.map((user, index) => (
                        <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-black/20"}>
                          <td className="p-0.5 border border-black/70 autoFix font-bold text-center">{index + 1}</td>
                          <td className="p-0.5 border border-black/70 autoFix">{user.first_name} {user.last_name}</td>
                          <td className='p-0.5 border border-black/70 autoFix'>
                            {user.category}
                          </td>
                          <td className='p-0.5 border border-black/70 autoFix'>{user.company}</td>
                          <td className='p-0.5 border border-black/70 autoFix'>{user.gsm}</td>
                          <td className='p-0.5 border border-black/70 autoFix'>{user.email}</td>
                        </tr>
                      )) || []}
                      {/* Boş satırlar ekleyerek 38 satıra tamamla */}
                      {Array.from({ 
                        length: Math.max(0, 38 - (selectedGroupContext?.users?.length || 0)) 
                      }).map((_, index) => (
                        <tr key={`empty-main-${index}`} className={((selectedGroupContext?.users?.length || 0) + index) % 2 === 0 ? "bg-white" : "bg-black/20"}>
                          <td className="p-0.5 border border-black/70 autoFix font-bold text-center">{(selectedGroupContext?.users?.length || 0) + index + 1}</td>
                          <td className="p-0.5 border border-black/70 autoFix"></td>
                          <td className='p-0.5 border border-black/70 autoFix'></td>
                          <td className='p-0.5 border border-black/70 autoFix'></td>
                          <td className='p-0.5 border border-black/70 autoFix'></td>
                          <td className='p-0.5 border border-black/70 autoFix'></td>
                        </tr>
                      ))}
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