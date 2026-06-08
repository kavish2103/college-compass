import { PrismaClient, CollegeType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.comparisonHistory.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user1 = await prisma.user.create({
    data: {
      name: 'Rohan Sharma',
      email: 'rohan@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: hashedPassword,
    },
  });

  console.log('Seeding colleges...');

  const collegeData = [
    {
      name: 'Indian Institute of Technology Bombay',
      location: 'Powai, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1958,
      description: 'Indian Institute of Technology Bombay (IIT Bombay) is a premier public technical and research university located in Powai, Mumbai, India. It is recognized as an Institute of National Importance and is world-renowned for its cutting-edge research, outstanding academic programs, and elite placement statistics.',
      website: 'https://www.iitb.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A++',
      baseAveragePackage: 23.5,
      baseMedianPackage: 21.0,
      baseHighestPackage: 150.0,
      recruiters: ['Google', 'Microsoft', 'Qualcomm', 'Goldman Sachs', 'Tata Motors', 'Apple'],
    },
    {
      name: 'Indian Institute of Technology Delhi',
      location: 'Hauz Khas, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1961,
      description: 'Indian Institute of Technology Delhi (IIT Delhi) is a public technical and research university situated in Hauz Khas, New Delhi. One of India\'s oldest IITs, it consistently ranks among the top engineering colleges in India, fostering entrepreneurship and high-quality scientific research.',
      website: 'https://home.iitd.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A++',
      baseAveragePackage: 22.8,
      baseMedianPackage: 20.0,
      baseHighestPackage: 140.0,
      recruiters: ['Google', 'Microsoft', 'Uber', 'Tower Research', 'Samsung', 'HCL Technologies'],
    },
    {
      name: 'Indian Institute of Technology Madras',
      location: 'Adyar, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1959,
      description: 'IIT Madras is a public technical and research university located in Chennai, Tamil Nadu. It has been ranked as the No. 1 engineering institute in India by NIRF for several consecutive years and has a beautiful residential campus next to Guindy National Park.',
      website: 'https://www.iitm.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A++',
      baseAveragePackage: 21.4,
      baseMedianPackage: 19.5,
      baseHighestPackage: 130.0,
      recruiters: ['Google', 'Amazon', 'Cisco', 'Microsoft', 'Intel', 'Robert Bosch'],
    },
    {
      name: 'Indian Institute of Technology Kharagpur',
      location: 'Kharagpur',
      city: 'Kharagpur',
      state: 'West Bengal',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1951,
      description: 'IIT Kharagpur was the first of the IITs to be established, set up in 1951. It has the largest campus area and the most departments among all IITs, providing exceptional diversity in research and industrial relations.',
      website: 'https://www.iitkgp.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A+',
      baseAveragePackage: 19.8,
      baseMedianPackage: 18.0,
      baseHighestPackage: 120.0,
      recruiters: ['Google', 'Microsoft', 'Apple', 'Reliance', 'PwC', 'J.P. Morgan'],
    },
    {
      name: 'Indian Institute of Technology Kanpur',
      location: 'Kalyanpur, Kanpur',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1959,
      description: 'IIT Kanpur is a public technical school famous for its computer science department, aeronautical facilities, and strong academic rigor. It has one of the best computing infrastructures in the country.',
      website: 'https://www.iitk.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A++',
      baseAveragePackage: 20.5,
      baseMedianPackage: 18.5,
      baseHighestPackage: 125.0,
      recruiters: ['Google', 'Microsoft', 'Nvidia', 'Intel', 'Capital One', 'Texas Instruments'],
    },
    {
      name: 'Birla Institute of Technology and Science, Pilani',
      location: 'Vidya Vihar, Pilani',
      city: 'Pilani',
      state: 'Rajasthan',
      type: CollegeType.PRIVATE,
      establishedYear: 1964,
      description: 'BITS Pilani is India\'s top-ranked private science and technology university. Known for its unique "no reservation" and "zero attendance" policies, BITS breeds high levels of student autonomy, entrepreneurship, and a massive network of corporate alumni.',
      website: 'https://www.bits-pilani.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A',
      baseAveragePackage: 19.2,
      baseMedianPackage: 17.0,
      baseHighestPackage: 70.0,
      recruiters: ['Amazon', 'Microsoft', 'Uber', 'Goldman Sachs', 'Citi', 'Boston Consulting Group'],
    },
    {
      name: 'National Institute of Technology Trichy',
      location: 'Tanjore Main Road, Tiruchirappalli',
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1964,
      description: 'NIT Trichy (formerly Regional Engineering College Tiruchirappalli) is consistently ranked as the top National Institute of Technology in India, attracting premium engineering aspirants from all states.',
      website: 'https://www.nitt.edu',
      logoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A+',
      baseAveragePackage: 15.6,
      baseMedianPackage: 14.0,
      baseHighestPackage: 55.0,
      recruiters: ['Microsoft', 'Amazon', 'Qualcomm', 'L&T', 'Oracle', 'Samsung'],
    },
    {
      name: 'National Institute of Technology Surathkal',
      location: 'Srinivasnagar, Mangaluru',
      city: 'Mangaluru',
      state: 'Karnataka',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1960,
      description: 'NIT Surathkal is a premium public engineering college situated right on the shore of the Arabian Sea in Karnataka. It offers high quality technical education and boasts spectacular campus placements.',
      website: 'https://www.nitk.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A+',
      baseAveragePackage: 15.2,
      baseMedianPackage: 13.5,
      baseHighestPackage: 54.0,
      recruiters: ['Microsoft', 'Amazon', 'Qualcomm', 'Intel', 'HP', 'TCS'],
    },
    {
      name: 'Vellore Institute of Technology',
      location: 'Katpadi, Vellore',
      city: 'Vellore',
      state: 'Tamil Nadu',
      type: CollegeType.PRIVATE,
      establishedYear: 1984,
      description: 'Vellore Institute of Technology (VIT) is a renowned private research university. It features highly progressive education schemas, massive infrastructure, and records some of the highest numbers of job offers in the country yearly.',
      website: 'https://vit.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1568792905994-0437a93b403c?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A++',
      baseAveragePackage: 8.9,
      baseMedianPackage: 8.0,
      baseHighestPackage: 44.0,
      recruiters: ['TCS', 'Wipro', 'Cognizant', 'Infosys', 'Microsoft', 'Intel'],
    },
    {
      name: 'Manipal Institute of Technology',
      location: 'Madhav Nagar, Manipal',
      city: 'Manipal',
      state: 'Karnataka',
      type: CollegeType.PRIVATE,
      establishedYear: 1957,
      description: 'Manipal Institute of Technology (MIT) is a private engineering college constituent of Manipal Academy of Higher Education. Located in the beautiful university town of Manipal, it is highly rated for its student life and global collaborations.',
      website: 'https://www.manipal.edu',
      logoUrl: 'https://images.unsplash.com/photo-1541829019-259273aed9b3?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A+',
      baseAveragePackage: 9.2,
      baseMedianPackage: 8.5,
      baseHighestPackage: 45.0,
      recruiters: ['Microsoft', 'Amazon', 'Deloitte', 'TCS', 'Accenture', 'Schneider Electric'],
    },
    {
      name: 'Delhi Technological University',
      location: 'Bawana Road, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1941,
      description: 'Delhi Technological University (formerly Delhi College of Engineering) is a public state university in New Delhi. Known for its strong industry connection, DTU has incubated several popular tech startups and provides elite tech placements.',
      website: 'http://www.dtu.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1141?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A',
      baseAveragePackage: 16.5,
      baseMedianPackage: 15.0,
      baseHighestPackage: 64.0,
      recruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Paytm', 'Samsung'],
    },
    {
      name: 'Netaji Subhas University of Technology',
      location: 'Dwarka, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1983,
      description: 'Netaji Subhas University of Technology (formerly NSIT) is a state university located in Dwarka, New Delhi. It is highly sought after by students for its excellent computer science engineering placement statistics.',
      website: 'http://www.nsut.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A',
      baseAveragePackage: 15.8,
      baseMedianPackage: 14.2,
      baseHighestPackage: 60.0,
      recruiters: ['Google', 'Microsoft', 'Amazon', 'Visa', 'Directi', 'Flipkart'],
    },
    {
      name: 'International Institute of Information Technology Hyderabad',
      location: 'Gachibowli, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      type: CollegeType.DEEMED,
      establishedYear: 1998,
      description: 'IIIT Hyderabad is a private deemed university founded as a non-profit public-private partnership. It is highly prestigious for its computer science research output, competitive coding achievements, and average placements matching top IITs.',
      website: 'https://www.iiit.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A+',
      baseAveragePackage: 26.0,
      baseMedianPackage: 24.5,
      baseHighestPackage: 85.0,
      recruiters: ['Google', 'Microsoft', 'Meta', 'Salesforce', 'Apple', 'Nvidia'],
    },
    {
      name: 'International Institute of Information Technology Bangalore',
      location: 'Electronic City, Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
      type: CollegeType.DEEMED,
      establishedYear: 1999,
      description: 'IIIT Bangalore is a registered society promoted jointly by the Government of Karnataka and the IT Industry. It is situated in Electronic City and focuses heavily on graduate research and high-value tech placements.',
      website: 'https://www.iiitb.ac.in',
      logoUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A+',
      baseAveragePackage: 24.2,
      baseMedianPackage: 22.0,
      baseHighestPackage: 80.0,
      recruiters: ['Microsoft', 'Amazon', 'Siemens', 'Qualcomm', 'Intel', 'Morgan Stanley'],
    },
    {
      name: 'SRM Institute of Science and Technology',
      location: 'Kattankulathur, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      type: CollegeType.DEEMED,
      establishedYear: 1985,
      description: 'SRM Institute of Science and Technology is a co-educational private deemed university. It features massive enrollments, a high-quality global exposure program, and a modern green campus.',
      website: 'https://www.srmist.edu.in',
      logoUrl: 'https://images.unsplash.com/photo-1590012314607-cda9d9b6a9a9?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A++',
      baseAveragePackage: 7.8,
      baseMedianPackage: 7.0,
      baseHighestPackage: 42.0,
      recruiters: ['TCS', 'Infosys', 'Cognizant', 'Capgemini', 'IBM', 'Amazon'],
    },
    {
      name: 'Thapar Institute of Engineering and Technology',
      location: 'Patiala',
      city: 'Patiala',
      state: 'Punjab',
      type: CollegeType.DEEMED,
      establishedYear: 1956,
      description: 'Thapar University is one of India\'s oldest private technical institutions, known for excellent labs, research publications, and ties with foreign universities like Trinity College Dublin.',
      website: 'https://www.thapar.edu',
      logoUrl: 'https://images.unsplash.com/photo-1576085898323-218337e3343c?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A+',
      baseAveragePackage: 10.5,
      baseMedianPackage: 9.8,
      baseHighestPackage: 48.0,
      recruiters: ['JPMC', 'Apple', 'Sandisk', 'Microsoft', 'TCS', 'Accenture'],
    },
    {
      name: 'Amity University Noida',
      location: 'Sector 125, Noida',
      city: 'Noida',
      state: 'Uttar Pradesh',
      type: CollegeType.PRIVATE,
      establishedYear: 2005,
      description: 'Amity University Noida is a private university boasting state-of-the-art sports facilities, global campuses, and highly diversified course options extending across tech, law, and liberal arts.',
      website: 'https://www.amity.edu',
      logoUrl: 'https://images.unsplash.com/photo-1560785496-3c9d2787718e?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A+',
      baseAveragePackage: 6.8,
      baseMedianPackage: 6.0,
      baseHighestPackage: 35.0,
      recruiters: ['TCS', 'Infosys', 'Wipro', 'Capgemini', 'Cognizant', 'Accenture'],
    },
    {
      name: 'Lovely Professional University',
      location: 'Jalandhar-Delhi G.T. Road, Phagwara',
      city: 'Phagwara',
      state: 'Punjab',
      type: CollegeType.PRIVATE,
      establishedYear: 2005,
      description: 'Lovely Professional University (LPU) is a private university situated in Phagwara, Punjab. It is the largest single-campus private university in India, housing thousands of international students and representing diverse academic branches.',
      website: 'https://www.lpu.in',
      logoUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A++',
      baseAveragePackage: 6.5,
      baseMedianPackage: 5.8,
      baseHighestPackage: 38.0,
      recruiters: ['Cognizant', 'Capgemini', 'Amazon', 'Bosch', 'TCS', 'Intel'],
    },
    {
      name: 'College of Engineering Guindy',
      location: 'Sardar Patel Road, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1794,
      description: 'College of Engineering Guindy is a public engineering college in Chennai and is one of the oldest technical institutions in Asia. It acts as the main campus of Anna University and offers high-quality engineering programs.',
      website: 'https://www.annauniv.edu',
      logoUrl: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A',
      baseAveragePackage: 11.2,
      baseMedianPackage: 10.0,
      baseHighestPackage: 40.0,
      recruiters: ['Caterpillar', 'Ford', 'L&T', 'Qualcomm', 'Microsoft', 'TCS'],
    },
    {
      name: 'Jadavpur University',
      location: 'Jadavpur, Kolkata',
      city: 'Kolkata',
      state: 'West Bengal',
      type: CollegeType.GOVERNMENT,
      establishedYear: 1955,
      description: 'Jadavpur University is a premier public state university located in Kolkata, West Bengal. Renowned for its highly affordable fee structure, student activism, and engineering departments that produce top research and placements.',
      website: 'http://www.jaduniv.edu.in',
      logoUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A++',
      baseAveragePackage: 14.8,
      baseMedianPackage: 13.0,
      baseHighestPackage: 58.0,
      recruiters: ['Microsoft', 'Amazon', 'J.P. Morgan', 'PwC', 'Tata Steel', 'Texas Instruments'],
    },
    {
      name: 'PSG College of Technology',
      location: 'Peelamedu, Coimbatore',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      type: CollegeType.PRIVATE,
      establishedYear: 1951,
      description: 'PSG College of Technology is a government-aided private engineering college in Coimbatore. It is highly respected in the manufacturing and core sectors, offering excellent industry-integrated education.',
      website: 'http://www.psgtech.edu',
      logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80',
      naacGrade: 'A+',
      baseAveragePackage: 10.1,
      baseMedianPackage: 9.2,
      baseHighestPackage: 42.0,
      recruiters: ['L&T', 'Intel', 'Bosch', 'Caterpillar', 'TCS', 'Wipro'],
    },
  ];

  const reviewTemplates = [
    {
      title: 'Amazing Academics and Elite Placements',
      content: 'Choosing this college was the best decision of my life. The faculty is highly research-oriented, and the campus environment is intellectually stimulating. The placement cell is incredibly active and guarantees multiple top companies visit.',
      pros: 'Elite placements, highly qualified professors, world-class research facilities, and a robust alumni network.',
      cons: 'Competitive atmosphere can get stressful at times. Academic workload is very heavy.',
      rating: 5,
    },
    {
      title: 'Great Infrastructure but Strict Rules',
      content: 'The infrastructure here is outstanding — green campus, massive library, and excellent labs. However, the administration imposes strict rules, and academic schedules are rigidly structured.',
      pros: 'State-of-the-art laboratory gear, beautiful clean campus, and regular industry guest talks.',
      cons: 'Strict attendance policies, slightly average hostel food quality.',
      rating: 4,
    },
    {
      title: 'Decent College for Core Branches',
      content: 'This college has deep ties with core manufacturing and tech companies. While the coding culture is picking up, core engineering branches like Mechanical and Electrical get amazing hands-on lab exposures.',
      pros: 'Excellent practical labs, helpful senior network, and supportive staff.',
      cons: 'Outdated curriculum in some subjects, less focus on extracurricular activities.',
      rating: 4,
    },
    {
      title: 'Average Value for High Fees',
      content: 'The college has fancy buildings and lists top recruiters, but the intake is massive. You have to work extremely hard to stand out in the crowded batch. The ROI is average if you do not get into the top 10% bracket.',
      pros: 'Modern amenities, sports fields, good cafeteria.',
      cons: 'Very high tuition fees, crowded classrooms, mass recruitment focus.',
      rating: 3,
    },
    {
      title: 'Highly Recommended for Computer Science',
      content: 'If you get Computer Science or IT branches here, go for it! The coding culture, hackathons, and placement records for software roles are comparable to some of the best colleges in the country.',
      pros: 'Active coding clubs, outstanding CS placements, and startup-friendly incubation center.',
      cons: 'Hostel facilities are average for the price, mess food can be improved.',
      rating: 5,
    },
  ];

  const authors = ['Aravind Nair', 'Sneha Roy', 'Vikram Singh', 'Ananya Gupta', 'Kabir Mehta', 'Riya Sen', 'Rahul Verma', 'Meera Iyer'];
  const batches = ['2020-2024', '2021-2025', '2019-2023', '2022-2026', '2018-2022'];

  for (const c of collegeData) {
    const createdCollege = await prisma.college.create({
      data: {
        name: c.name,
        location: c.location,
        city: c.city,
        state: c.state,
        type: c.type,
        establishedYear: c.establishedYear,
        description: c.description,
        website: c.website,
        logoUrl: c.logoUrl,
        naacGrade: c.naacGrade,
      },
    });

    // Seed 3-5 courses per college
    const isGovt = c.type === CollegeType.GOVERNMENT;
    const isBits = c.name.includes('BITS');
    const multiplier = isGovt ? (isBits ? 2.5 : 1) : 3.0; // private/deemed/BITS are costlier
    
    await prisma.course.createMany({
      data: [
        {
          name: 'Computer Science and Engineering',
          degree: 'B.Tech',
          duration: 4,
          annualFees: multiplier * 180000,
          totalFees: multiplier * 180000 * 4,
          seats: 120,
          collegeId: createdCollege.id,
        },
        {
          name: 'Electronics and Communication Engineering',
          degree: 'B.Tech',
          duration: 4,
          annualFees: multiplier * 150000,
          totalFees: multiplier * 150000 * 4,
          seats: 100,
          collegeId: createdCollege.id,
        },
        {
          name: 'Data Science & Artificial Intelligence',
          degree: 'M.Tech',
          duration: 2,
          annualFees: multiplier * 200000,
          totalFees: multiplier * 200000 * 2,
          seats: 40,
          collegeId: createdCollege.id,
        },
        {
          name: 'Master of Business Administration',
          degree: 'MBA',
          duration: 2,
          annualFees: multiplier * 250000,
          totalFees: multiplier * 250000 * 2,
          seats: 60,
          collegeId: createdCollege.id,
        },
      ],
    });

    // Seed 3 years of placements per college
    const years = [2022, 2023, 2024];
    await prisma.placement.createMany({
      data: years.map((yr, idx) => {
        // slightly improve package values per year
        const annualGrowth = 1 + (idx * 0.05); 
        return {
          year: yr,
          averagePackage: Number((c.baseAveragePackage * annualGrowth).toFixed(2)),
          medianPackage: Number((c.baseMedianPackage * annualGrowth).toFixed(2)),
          highestPackage: Number((c.baseHighestPackage * (1 + (idx * 0.1))).toFixed(2)),
          placementRate: Number((90 + idx * 2.5).toFixed(1)),
          topRecruiters: c.recruiters,
          collegeId: createdCollege.id,
        };
      }),
    });

    // Seed 5-8 reviews per college
    const numReviews = Math.floor(Math.random() * 4) + 5; // 5 to 8 reviews
    let totalReviewRating = 0;

    for (let rIdx = 0; rIdx < numReviews; rIdx++) {
      const template = reviewTemplates[rIdx % reviewTemplates.length];
      const author = authors[Math.floor(Math.random() * authors.length)];
      const batch = batches[Math.floor(Math.random() * batches.length)];
      
      const ratingVariance = (rIdx % 3) - 1; // -1, 0, 1 to add variance
      const rating = Math.max(1, Math.min(5, template.rating + ratingVariance));

      totalReviewRating += rating;

      await prisma.review.create({
        data: {
          rating,
          title: template.title,
          content: template.content,
          pros: template.pros,
          cons: template.cons,
          authorName: `${author} ${rIdx}`,
          batch,
          course: rIdx % 2 === 0 ? 'B.Tech CSE' : 'B.Tech ECE',
          isVerified: Math.random() > 0.3,
          collegeId: createdCollege.id,
          // associate a user if available
          userId: rIdx === 0 ? user1.id : rIdx === 1 ? user2.id : null,
        },
      });
    }

    // Update aggregate ratings on college
    const overallRating = Number((totalReviewRating / numReviews).toFixed(1));
    await prisma.college.update({
      where: { id: createdCollege.id },
      data: {
        overallRating,
        totalReviews: numReviews,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
