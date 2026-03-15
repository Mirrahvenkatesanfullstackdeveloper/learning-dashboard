// Background patterns and gradients for the application
export const backgrounds = {
  // Geometric patterns
  pattern1: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  
  // Dots pattern
  pattern2: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23764ba2' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
  
  // Lines pattern
  pattern3: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23667eea' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
  
  // Waves pattern
  pattern4: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='waves' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50' stroke='%23667eea' stroke-width='2' fill='none' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23waves)'/%3E%3C/svg%3E")`,
  
  // Gradient backgrounds
  gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradient2: 'linear-gradient(135deg, #f8b042 0%, #f56565 100%)',
  gradient3: 'linear-gradient(135deg, #48bb78 0%, #4299e1 100%)',
  gradient4: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  
  // Mesh gradients
  mesh1: `radial-gradient(at 40% 20%, hsla(228, 100%, 74%, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(270, 100%, 70%, 0.2) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(343, 100%, 76%, 0.2) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(240, 100%, 70%, 0.2) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(343, 100%, 76%, 0.2) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(240, 100%, 70%, 0.2) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 0.2) 0px, transparent 50%)`,
  
  mesh2: `radial-gradient(at 0% 30%, hsla(210, 100%, 70%, 0.3) 0px, transparent 50%),
          radial-gradient(at 50% 50%, hsla(280, 100%, 70%, 0.2) 0px, transparent 50%),
          radial-gradient(at 100% 70%, hsla(340, 100%, 70%, 0.2) 0px, transparent 50%)`,
};

// Slide backgrounds for presentation/carousel
export const slideBackgrounds = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
    overlay: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
    title: 'Learn Together',
    description: 'Join a community of learners and educators'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    overlay: 'linear-gradient(135deg, rgba(248, 176, 66, 0.8) 0%, rgba(245, 101, 101, 0.8) 100%)',
    title: 'Track Progress',
    description: 'Monitor your learning journey with analytics'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    overlay: 'linear-gradient(135deg, rgba(72, 187, 120, 0.8) 0%, rgba(66, 153, 225, 0.8) 100%)',
    title: 'Achieve Goals',
    description: 'Personalized study plans for your success'
  }
];