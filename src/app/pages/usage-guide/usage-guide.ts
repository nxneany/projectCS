import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-usage-guide',
  imports: [CommonModule, Header, Footer],
  templateUrl: './usage-guide.html',
  styleUrl: './usage-guide.scss'
})
export class UsageGuideComponent {
  steps = [
    {
      title: 'เช่า',
      detail: 'เช่าชุดสำหรับขบวนพาเหรด เทศกาล และงานสำคัญต่างๆ ที่ให้บริการเช่าชุดคุณภาพสูง หลากหลายสไตล์ ไม่ว่าจะเป็นชุดไทย ชุดแฟนซี ชุดวัฒนธรรมจากประเทศต่างๆ หรือชุดทีมสำหรับการแสดง'
    },
    {
      title: 'สวมใส่',
      detail: 'เลือกชุดที่คุณชอบตามโอกาส และไซส์ ในราคาที่จับต้องได้ เมื่อนำไปใช้แล้วอย่าลืมแชร์ภาพถ่ายของคุณกับชุดสวยพร้อมแฮชแท็ก #Dress Me Up เพื่อช่วยเป็นสไตล์ให้สำหรับผู้ที่สนใจเช่าชุดในงานต่างๆ'
    },
    {
      title: 'ส่งคืนฟรี',
      detail: 'คืนชุดด้วยวิธีง่ายๆ ไม่ว่าจะส่งคืนทางไปรษณีย์, คืนด้วยตัวเองที่หน้าร้าน หรือใช้บริการจัดส่ง Grab ในเขตมหาสารคาม ที่สำคัญเราดูแลทำความสะอาดชุดทั้งก่อนและหลังการให้บริการ เพื่อความสะอาดสบายที่สุด ของลูกค้า Dress Me Up'
    }
  ];
}
