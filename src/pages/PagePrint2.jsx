import React, { useState, useEffect } from 'react';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import { groupMembersService } from '../services/groupMembers.service';
import { eventsService } from '../services/events.service';
import { visitsService } from '../services/visits.service';
import { openCategoriesService } from '../services/openCategories.service';
import { presentationsService } from '../services/presentations.service';
import './PagePrint.css';
import { useGroup } from '../contexts/GroupContext';

const PagePrint2 = () => {  
  const { selectedGroupContext } = useGroup();
  const [leaderMembers, setLeaderMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [presentations, setPresentations] = useState([]);
  const [openCategories, setOpenCategories] = useState([]);
  const [visitorCommitteeMembers, setVisitorCommitteeMembers] = useState([]);
  const [membershipCommitteeMembers, setMembershipCommitteeMembers] = useState([]);
  const [groupAmbassadors, setGroupAmbassadors] = useState([]); 
  const [consultingDirectors, setConsultingDirectors] = useState([]);

  useEffect(() => {
    fetchLeaderMembers();
    fetchEvents();
    fethVisitors();
    fetchPresentations();
    fetchOpenCategories();
    filterVisitorCommitteeMembers();
    filterMembershipCommitteeMembers();
    filterGroupAmbassadors();
    filterConsultingDirectors();
    console.log("selectedGroupContext", selectedGroupContext);
    console.log("leaderMembers", leaderMembers);
    console.log("events", events);
    console.log("visitors", visitors);
    console.log("openCategories", openCategories);
    console.log("visitorCommitteeMembers", visitorCommitteeMembers);
    console.log("membershipCommitteeMembers", membershipCommitteeMembers);
    console.log("groupAmbassadors", groupAmbassadors);
    console.log("consultingDirectors", consultingDirectors);
  }, [selectedGroupContext]);

  const fetchLeaderMembers = async () => {
    const leaderMembers = await groupMembersService.getGroupLeaderTeam(selectedGroupContext?.id);
    setLeaderMembers(leaderMembers);
  }

  const fetchEvents = async () => {
    const events = await eventsService.getEvents(selectedGroupContext?.id);
    console.log("Tüm çekilen events:", events);
    setEvents(events); // Tüm etkinlikleri set et, filtrelemeyi UI'da yapacağız
  }

  const fethVisitors = async () => {
    setIsLoading(true);
    try {
      const response = await visitsService.getVisits(selectedGroupContext.id);
      console.log("Ziyaretçiler alındı:", response);
      setVisitors(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Ziyaretçiler alınırken hata oluştu:", error);
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

  const handlePrint = () => {
    window.print();
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
                                  {/* {member.roles && member.roles.find(role => role.category === 'Ziyaretçi Komitesi') && (
                                    <span className="text-[9px] text-gray-600 block">
                                      ({member.roles.find(role => role.category === 'Ziyaretçi Komitesi').role})
                                    </span>
                                  )} */}
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

                          console.log("Tüm events:", events);
                          console.log("Filtrelenmiş upcomingEvents:", upcomingEvents);

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
                <table className="w-full border-collapse mt-4 autoFix">
                    <thead>
                      <tr>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Sıra</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Ad Soyad</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Kategori</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Slogan</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Spesifik İstek</th>
                      </tr>
                    </thead>
                    <tbody className='text-[9px]'>
                      {selectedGroupContext?.users?.map((user, index) => (
                        <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-black/20"}>
                          <td className="p-1 border border-black/70 autoFix font-bold text-center">{index + 1}</td>
                          <td className="p-1 border border-black/70 autoFix">{user.first_name} {user.last_name}</td>
                          <td className='p-1 border border-black/70 autoFix'>
                            {user.category}
                          </td>
                          <td className='p-1 border border-black/70 autoFix'>{user.slogan}</td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                        </tr>
                      )) || []}
                      {/* Boş satırlar ekleyerek 45 satıra tamamla */}
                      {Array.from({ 
                        length: Math.max(0, 45 - (selectedGroupContext?.users?.length || 0)) 
                      }).map((_, index) => (
                        <tr key={`empty-main-${index}`} className={((selectedGroupContext?.users?.length || 0) + index) % 2 === 0 ? "bg-white" : "bg-black/20"}>
                          <td className="p-0.5 border border-black/70 autoFix font-bold text-center">{(selectedGroupContext?.users?.length || 0) + index + 1}</td>
                          <td className="p-0.5 border border-black/70 autoFix"></td>
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

export default PagePrint2;