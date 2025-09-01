import React, { useRef } from 'react';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import './PagePrint.css'; // CSS dosyasını import edeceğiz

const PagePrint = () => {  
  const printRef = useRef(null);

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

      {/* A4 Sayfa Konteyner */}
      <div className="flex justify-center">
        <div 
          ref={printRef}
          className="a4-page"
        >
          {/* Buraya içeriğinizi ekleyebilirsiniz */}
          <div className="a4-content pb-[50px] autoFix">
            {/* İçerik buraya gelecek */}
            <div className='text-[12px] gap-2 font-bold h-[63px] pl-[20px] pr-[20px] flex items-center autoFix'>
                <img className='w-[90px]' src={bniLogo} alt="" />
                <div className='flex items-start flex-col flex-grow'>
                    <h2 className=' font-bold text-xl text-[#C80F2E]'>
                        PRUVA GRUP TOPLANTISI
                    </h2>
                    <p className='text-xs font-light text-[#C80F2E]'>
                        Türkiye’nin İş Yapış Biçimini Değiştiriyoruz
                    </p>
                    <div className='w-full h-[1px] bg-[#000000]'></div>
                </div>
            </div>
            <div className='pl-[20px] pr-[20px] autoFix'>
                <div className='font-bold text-xl'>BNI PRUVA Her Perşembe Sabahı - 07:00 - 09:00 Arası</div>
                <div className='text-xs font-light text-[#000000] text-end'>www.bni.com.tr</div>
                <div className='w-full h-[1px] bg-[#000000]'></div>
            </div>
            <div className='flex pl-[20px] pr-[20px] autoFix'>
                <div className='w-2.5/10'>
                    <div>
                        <div className='font-bold text-center text-md p-[7px] bg-[#F3F3F3] mt-[15px] w-full autoFix'>RAKAMLARLA PRUVA</div>
                        <div>
                            <div className='font-bold text-sm text-center'>01.06.2025 <span className='font-light text-sm'>Tarihi İtibariyle</span></div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-2 mt-[20px] autoFix'>
                        <div className='font-bold text-md'>Yönlendirme</div>
                        <div className='font-bold text-6xl text-[#C80F2E]'>911</div>
                    </div>
                    <div className='flex flex-col items-center gap-2 mt-[20px] autoFix'>
                        <div className='font-bold text-md'>Ciro</div>
                        <div className='font-bold text-2xl text-[#C80F2E]'>₺19.215.107</div>
                    </div>
                    <div className='flex flex-col items-center gap-2 mt-[20px] autoFix'>
                        <div className='font-bold text-md'>1'E 1</div>
                        <div className='font-bold text-6xl text-[#C80F2E] autoFix'>634</div>
                    </div>
                    <div className='flex flex-col items-center gap-2 mt-[20px] autoFix'>
                        <div className='font-bold text-md'>Ziyaretçi</div>
                        <div className='font-bold text-6xl text-[#C80F2E] autoFix'>152</div>
                    </div>
                    <div className='font-bold text-center text-md p-[7px] bg-[#F3F3F3] mt-[15px] w-full autoFix'>TEMMUZ AYI</div>
                    <div className='font-bold text-center text-md p-[7px] bg-[#F3F3F3] w-full autoFix'>NETWORK LİDERLERİ</div>
                    <div className='flex flex-col items-center'>
                        <div className='flex flex-col items-center'>
                            <div className='font-bold text-center text-md p-[7px] pb-0 w-full autoFix'>iŞ YÖNLENDİRME</div>
                            <div className='text-center text-sm w-full autoFix'>Muhammed Emin Tezcan</div>
                        </div>
                        <div className='font-bold text-6xl text-[#C80F2E] p-[25px] autoFix'>9</div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='flex flex-col items-center'>
                            <div className='font-bold text-center text-md w-full autoFix'>ZİYARETİ DAVETİ</div>
                            <div className='text-center text-sm w-full autoFix'>Yusuf Ziya Nisanoğlu</div>
                        </div>
                        <div className='font-bold text-6xl text-[#C80F2E] p-[25px] autoFix'>3</div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='flex flex-col items-center'>
                            <div className='font-bold text-center text-md w-full autoFix'>CİRO</div>
                            <div className='text-center text-sm w-full autoFix'>Zafer Yıldırım</div>
                        </div>
                        <div className='font-bold text-2xl text-[#C80F2E] p-[20px] autoFix'>₺19.215.107</div>
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
                        <div className='text-xl text-white font-bold'>Dilan Özdemir</div>
                        <div className='text-xl text-white font-bold'>Catering Hizmetleri</div>
                    </div>
                    <div className='flex flex-col items-center gap-2 mt-[10px] autoFix'>
                        <div className='text-xl'>Katkı Anonsları</div>
                        <div className='text-xl'>Grubun Başarıları</div>
                    </div>
                    <div className='flex flex-col gap-2 mt-[10px] autoFix'>
                        <div className='text-xl text-[#D11C2F] font-bold underline text-center'>Yaklaşan Etkinlikler</div>
                        <div className='text-sm font-bold flex justify-between'>
                            <div className='w-2/3'>YÖNETİM TAKIMLARI TOPLANTISI</div>
                            <div>09.08.2025</div>
                        </div>
                        <div className='text-sm font-bold flex justify-between'>
                            <div className='w-2/3'>BNI ONLINE SERBEST NETWORKING ETKİNLİĞİ</div>
                            <div>09.08.2025</div>
                        </div>
                    </div>
                    <div className='text-xl text-center mt-[15px] autoFix'>Kapanış</div>
                    <div className='flex flex-col flex-grow justify-between gap-2 mt-[10px] autoFix'>
                        <div className='text-xl text-[#D11C2F] font-bold underline text-center mt-[25px] autoFix'>Haftanın Alıntısı</div>
                        <div className='text-center pl-[25px] pr-[25px] autoFix'>Fırsatlar durup dururken karşınıza çıkmaz, onları siz
                        yaratırsınız. </div>
                        <div className='text-end pr-[15px] autoFix'>Chris Grosser</div>
                    </div>
                </div>
                <div className='w-[1px] h-auto bg-[#000000]'></div>
                <div className='w-2.5/10'>
                    <div className='font-bold text-center text-md p-[7px] bg-[#F3F3F3] mt-[15px] w-full autoFix'>LİDER EKİP ÜYELERİMİZ</div>
                    <ul className='flex flex-col gap-2 mt-[20px] pl-[3px] autoFix'>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Grup Başkanı</div>
                            <div className='text-sm'>Muhammet Emin Tezcan</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Üyelik Komitesi Başkanı</div>
                            <div className='text-sm'>Cemile Yaşar</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Sayman</div>
                            <div className='text-sm'>Ozan Albal</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Eğitim Koordinatörü</div>
                            <div className='text-sm'>Yusuf Ziya Nisanoğlu</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Etkinlik Koordinatörü</div>
                            <div className='text-sm'>İsmail Yapıcı</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Birebir Koordinatörü</div>
                            <div className='text-sm'>Hasan Hüseyin Köroğlu</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Mentör Koordinatörü</div>
                            <div className='text-sm'>Selay Göytaş</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Güç Takımları Koordinatörü</div>
                            <div className='text-sm'>Kadir Arslan</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Oryantasyon Sorumlusu</div>
                            <div className='text-sm'>Yusuf Ziya Nisanoğlu</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Sosyal Medya Sorumlusu</div>
                            <div className='text-sm'>Cansu Dumlu</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Teknik Sorumlu</div>
                            <div className='text-sm'>Muhammet Yağız</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>BNI Elçisi</div>
                            <div className='text-sm'>Muhammet Emin Tezcan</div>
                        </li>
                        <li className='flex flex-col gap-1'>
                            <div className='text-xs text-[#D11C2F] font-bold'>Danışman Direktör</div>
                            <div className='text-sm'>Cenk Aydoğar</div>
                        </li>
                    </ul>
                    <div className='text-sm font-bold text-center bg-[#D11C2F] text-white mt-[15px] py-[10px] autoFix'>Gold Members</div>
                    <ul className='flex flex-col gap-1 pl-[3px] text-xs font-bold mt-[10px] autoFix'>
                        <li>Cemile Yaşar</li>
                        <li>Yusuf Ziya Nisanoğlu</li>
                    </ul>
                </div>
            </div>
            {/* <div className='pl-[28px] pr-[28px] autoFix'>
                <div className='mt-[10px] flex gap-[30px] autoFix'>
                    <div className='text-[15px] font-bold text-[#C80F2E]'>
                        Lider <br />
                        Ekip
                    </div>
                    <div>
                        <ul className='text-[12px] grid grid-cols-4 gap-x-[30px] gap-y-[10px]'>
                            <li>
                                <div>Grup Başkanı</div>
                                <div className='font-bold'>
                                    Muhammet Emin Tezcan
                                </div>
                            </li>
                            <li>
                                <div>Üyelik komitesi başkanı</div>
                                <div className='font-bold'>
                                    Cemile Yaşar
                                </div>
                            </li>
                            <li>
                                <div>Sayman</div>
                                <div className='font-bold'>
                                    Ozan Albal
                                </div>
                            </li>
                            <li>
                                <div>Eğitim Koordinatörü</div>
                                <div className='font-bold'>
                                    Yusuf Ziya Nisanoğlu
                                </div>
                            </li>
                            <li>
                                <div>Etkinlik Koordinatörü</div>
                                <div className='font-bold'>
                                    Alper Özkalkan
                                </div>
                            </li>
                            <li>
                                <div>Ziyaretçi Komitesi Başkanı</div>
                                <div className='font-bold'>
                                    Kerim Kuru 
                                </div>
                            </li>
                            <li>
                                <div>Birebir Koordinatörü</div>
                                <div className='font-bold'>
                                    Serhat Küçükuygun
                                </div>
                            </li>
                            <li>
                                <div>Mentör Koordinatörü</div>
                                <div className='font-bold'>
                                    Selay Göytaş
                                </div>
                            </li>
                            <li>
                                <div>Güç Takımları Koordinatörü</div>
                                <div className='font-bold'>
                                    Muhammet Yağız
                                </div>
                            </li>
                            <li>
                                <div>Oryantasyon Sorumlusu</div>
                                <div className='font-bold'>
                                    Yusuf Ziya Nisanoğlu
                                </div>
                            </li>
                            <li>
                                <div>Sosyal Medya Sorumlusu</div>
                                <div className='font-bold'>
                                    Cansu Dumlu
                                </div>
                            </li>
                            <li>
                                <div>Teknik Sorumlu</div>
                                <div className='font-bold'>
                                    Muhammet Yağız
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='h-[2px] w-full bg-[#F3F3F3] mt-[15px] mb-[15px] autoFix'></div>
                <div className='flex items-center gap-[18px]'>
                    <div className='text-[15px] text-[#C80F2E] font-bold'>Üyelik Komitesi</div>
                    <ul className='flex text-[12px] font-bold gap-[12px] flex-wrap'>
                        <li>Ozan Albal</li>
                        <li>Muhammet Yağız</li>
                        <li>Selay Göytaş</li>
                        <li>Yusuf Ziya Nisanoğlu</li>
                        <li>Kadir Arslan</li>
                    </ul>
                </div>
                <div className='h-[2px] w-full bg-[#F3F3F3] mt-[15px] mb-[15px] autoFix'></div>
                <div className='flex items-center gap-[18px]'>
                    <div className='text-[15px] text-[#C80F2E] font-bold'>Ziyaretçi Komitesi</div>
                    <ul className='flex text-[12px] font-bold gap-[12px] flex-wrap'>
                        <li>Kadir Arslan</li>
                        <li>Mustafa Dağtekin</li>
                        <li>Muhammet Emin Tezcan</li>
                    </ul>
                </div>
                <div className='h-[2px] w-full bg-[#F3F3F3] mt-[15px] mb-[15px] autoFix'></div>
                <div className='flex items-center gap-[18px]'>
                    <div className='text-[15px] text-[#C80F2E] font-bold'>Sunum<br />Rotasyonu</div>
                    <ul className='flex items-center text-[12px] font-bold gap-[12px] flex-wrap'>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                    </ul>
                </div>
                <div className='h-[2px] w-full bg-[#F3F3F3] mt-[15px] mb-[15px] autoFix'></div>
                <div className='flex items-center gap-[18px]'>
                    <div className='text-[15px] text-[#C80F2E] font-bold'>Açık<br />Kategoriler</div>
                    <ul className='flex items-center text-[12px] font-bold gap-[12px] flex-wrap'>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Akupuntur</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Masör</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Çieki</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Çikolata İmalatı</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Promosyon Ürünleri</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Astrolog</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Petshop</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Akvaryum/Balıklar</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Eczacı</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Masj Terapisti</div>
                        </li>
                    </ul>
                </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PagePrint;