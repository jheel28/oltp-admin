import hero1 from "assets/img/hero/L1.jpg";
import hero2 from "assets/img/hero/L2.jpg";
import hero3 from "assets/img/hero/L3.jpg";
import hero4 from "assets/img/hero/L4.jpg";
import hero5 from "assets/img/hero/L5.jpg";
import hero6 from "assets/img/hero/L6.jpg";
import hero7 from "assets/img/hero/L7.jpg";
import hero8 from "assets/img/hero/L8.jpg";
// import hero15 from "assets/img/hero/15.jpeg";

const mechanicalSubjects = [
  {
    slug: "engineering-mechanics",
    image: hero1,
    title: "Engineering Mechanics & Mechanics of Materials",
    displayTitle: "Engineering Mechanics & Mechanics of Materials (Strength of Materials)",
    subtitle: "Strength of Materials",
    hero: "Build the foundation of real-world engineering structures and systems.",
    heroSub:
      "Master the fundamental principles governing forces, motion, stress, and deformation — essential for designing safe and efficient mechanical systems.",
    about:
      "Engineering Mechanics and Strength of Materials form the analytical backbone of mechanical and structural engineering. These subjects deal with the behavior of bodies under the action of forces and moments, enabling engineers to predict motion, deformation, and failure conditions. From designing load-bearing structures and robotic arms to analyzing stress distribution in automotive and aerospace components, this domain is critical for ensuring structural integrity and performance. It also serves as the foundation for advanced simulation techniques such as Finite Element Analysis (FEA).",
    masterPoints: [
      "Force systems and equilibrium analysis",
      "Kinematics and kinetics of particles and rigid bodies",
      "Stress-strain relationships and material behavior",
      "Bending, torsion, and shear analysis",
      "Structural stability and failure theories",
      "Real-world load handling and safety evaluation",
    ],
    topics: [
      "Statics: Forces, Moments, Equilibrium",
      "Dynamics: Motion, Work-Energy, Impulse-Momentum",
      "Free Body Diagrams",
      "Friction and Contact Mechanics",
      "Stress and Strain Analysis",
      "Elasticity and Plasticity",
      "Bending Moment and Shear Force Diagrams",
      "Torsion of Circular Shafts",
      "Beam Deflection Methods",
      "Failure Theories (Von Mises, Tresca)",
      "Columns and Buckling Analysis",
      "Fatigue and Material Testing",
    ],
    testStructure: [
      "MCQs: Concept-based understanding",
      "MSQs: Multi-variable engineering analysis",
      "Numerical Problems: Structural and design-based applications",
      "Difficulty Levels: Beginner to Industry Level",
    ],
    platformFeatures: [
      "Real-time performance analytics",
      "Detailed step-by-step solutions",
      "Design-oriented numerical problems",
      "Case-based industry questions",
    ],
    whoShouldEnroll:
      "Mechanical and Civil Engineering students, Robotics engineers, Structural designers, Product engineers",
    price: "₹300/month",
    cta: "Develop the analytical strength required to design safe and efficient engineering systems.",
  },
  {
    slug: "cad-machine-drawing",
    image: hero2,
    title: "CAD & Machine Drawing",
    displayTitle: "CAD & Machine Drawing",
    subtitle: "",
    hero: "Transform engineering ideas into precise digital designs.",
    heroSub:
      "CAD and Machine Drawing are essential tools for modern product development and engineering visualization, enabling you to create accurate technical drawings, 3D models, and assemblies.",
    about:
      "CAD (Computer-Aided Design) and Machine Drawing are essential tools for modern product development and engineering visualization. This subject focuses on the creation of accurate technical drawings, 3D models, and assemblies used in manufacturing and prototyping. Engineers use CAD software to design components, simulate assemblies, and prepare models for manufacturing processes such as CNC machining and 3D printing. It is a core skill for roles in product design, automotive engineering, and industrial design.",
    masterPoints: [
      "Technical drawing standards and projections",
      "2D drafting and 3D solid modeling",
      "Assembly design and component integration",
      "Geometric Dimensioning and Tolerancing (GD&T)",
      "Design visualization and interpretation",
    ],
    topics: [
      "Engineering Drawing Fundamentals",
      "Orthographic and Isometric Projections",
      "Sectional Views and Dimensioning",
      "3D Part Modeling",
      "Assembly Modeling and Constraints",
      "Surface and Solid Modeling",
      "GD&T Standards",
      "Exploded Views and Bill of Materials",
      "Sheet Metal Design",
      "Design for Manufacturing (DFM)",
      "Design for Assembly (DFA)",
    ],
    testStructure: [
      "MCQs: CAD concepts and standards",
      "MSQs: Multi-step design logic",
      "Numerical: Tolerance and dimension calculations",
    ],
    platformFeatures: [
      "Visualization-based problem solving",
      "Industry-relevant CAD scenarios",
      "Design interpretation questions",
    ],
    whoShouldEnroll:
      "Design engineers, CAD learners, product developers, mechanical students",
    price: "₹300/month",
    cta: "Develop the ability to transform concepts into manufacturable designs.",
  },
  {
    slug: "engineering-mathematics",
    image: hero3,
    title: "Engineering Mathematics",
    displayTitle: "Engineering Mathematics",
    subtitle: "",
    hero: "The analytical foundation behind every engineering solution.",
    heroSub:
      "Engineering Mathematics provides the essential tools required for modeling, analysis, and optimization of engineering systems across all advanced engineering disciplines.",
    about:
      "Engineering Mathematics provides the essential tools required for modeling, analysis, and optimization of engineering systems. It plays a crucial role in simulation, control systems, data analysis, and computational methods. From solving differential equations in heat transfer to applying linear algebra in robotics and machine learning, this subject is fundamental to all advanced engineering applications.",
    masterPoints: [
      "Mathematical modeling of engineering systems",
      "Differential equations and transformations",
      "Linear algebra and vector spaces",
      "Numerical computation techniques",
      "Probability and statistical analysis",
    ],
    topics: [
      "Differential and Integral Calculus",
      "Ordinary and Partial Differential Equations",
      "Matrices, Eigenvalues, and Eigenvectors",
      "Vector Calculus",
      "Laplace and Fourier Transforms",
      "Probability and Statistics",
      "Numerical Methods and Error Analysis",
      "Optimization Techniques",
    ],
    testStructure: [
      "MCQs: Concept clarity",
      "MSQs: Multi-step logical reasoning",
      "Numerical: Applied engineering mathematics problems",
    ],
    platformFeatures: [
      "Stepwise problem solutions",
      "Application-driven questions",
      "Simulation-oriented numerical sets",
    ],
    whoShouldEnroll: "Engineering students, simulation learners, data-driven engineers",
    price: "₹300/month",
    cta: "Strengthen your mathematical foundation for advanced engineering applications.",
  },
  {
    slug: "thermodynamics-heat-transfer",
    image: hero4,
    title: "Thermodynamics & Heat Transfer",
    displayTitle: "Thermodynamics & Heat Transfer",
    subtitle: "",
    hero: "Understand energy systems and thermal behavior.",
    heroSub:
      "Master the principles of energy interactions, thermal systems, and heat flow mechanisms essential for designing engines, power plants, and thermal management systems.",
    about:
      "Thermodynamics and Heat Transfer deal with energy interactions, thermal systems, and heat flow mechanisms. These concepts are fundamental for designing engines, refrigeration systems, power plants, and thermal management systems. This subject is also critical for simulation-based engineering, where temperature distribution and energy efficiency are analyzed using computational tools.",
    masterPoints: [
      "Laws of thermodynamics and energy balance",
      "Heat transfer mechanisms",
      "Thermal system design and analysis",
      "Efficiency and performance optimization",
    ],
    topics: [
      "Thermodynamic Systems and Properties",
      "Zeroth, First, and Second Laws",
      "Entropy and Exergy Analysis",
      "Heat Conduction (Steady and Transient)",
      "Convection Heat Transfer",
      "Radiation Heat Transfer",
      "Heat Exchangers",
      "Refrigeration and Air Conditioning",
      "Power Cycles (Rankine, Brayton, Otto, Diesel)",
    ],
    testStructure: [
      "Concept-based assessments",
      "Numerical-intensive thermal problems",
    ],
    platformFeatures: [
      "Real-world thermal system problems",
      "Simulation-oriented questions",
    ],
    whoShouldEnroll: "Mechanical engineers, energy engineers, HVAC professionals",
    price: "₹300/month",
    cta: "Develop expertise in designing efficient energy systems.",
  },
  {
    slug: "machine-design",
    image: hero5,
    title: "Machine Design",
    displayTitle: "Machine Design",
    subtitle: "",
    hero: "Design reliable and efficient mechanical components.",
    heroSub:
      "Machine Design focuses on the systematic design of mechanical components considering strength, durability, safety, and manufacturability for real-world performance.",
    about:
      "Machine Design focuses on the systematic design of mechanical components considering strength, durability, safety, and manufacturability. It integrates knowledge from mechanics, materials, and manufacturing processes. This subject is essential for product development, where engineers must ensure that components perform reliably under real operating conditions.",
    masterPoints: [
      "Mechanical component design principles",
      "Material selection and safety factors",
      "Failure analysis and fatigue design",
      "Design optimization",
    ],
    topics: [
      "Design Fundamentals and Standards",
      "Stress and Strain Analysis",
      "Shaft Design",
      "Gear Design",
      "Bearings and Lubrication",
      "Springs and Fasteners",
      "Fatigue and Creep",
      "Design Optimization Techniques",
    ],
    testStructure: [
      "Design-oriented numerical assessments",
      "Analytical component design problems",
    ],
    platformFeatures: [
      "Industry-level component design problems",
      "Case-based failure analysis",
    ],
    whoShouldEnroll: "Mechanical designers, product engineers, manufacturing engineers",
    price: "₹300/month",
    cta: "Develop the capability to design robust and efficient machines.",
  },
  {
    slug: "theory-of-machines",
    image: hero6,
    title: "Theory of Machines & Mechanisms",
    displayTitle: "Theory of Machines & Mechanisms",
    subtitle: "",
    hero: "Analyze motion and design intelligent mechanical systems.",
    heroSub:
      "Study the motion, forces, and energy in mechanical systems — fundamental for designing mechanisms used in robotics, automation, and automotive applications.",
    about:
      "This subject focuses on the study of motion, forces, and energy in mechanical systems. It is fundamental for designing mechanisms used in robotics, automation, and automotive systems. Understanding how components move and interact allows engineers to develop efficient and precise machines.",
    masterPoints: [
      "Kinematics and dynamics of mechanisms",
      "Motion analysis and synthesis",
      "Gear and cam design",
      "Vibration analysis",
    ],
    topics: [
      "Kinematic Chains and Mechanisms",
      "Velocity and Acceleration Analysis",
      "Gears and Gear Trains",
      "Cams and Followers",
      "Flywheels",
      "Vibrations and Balancing",
      "Gyroscopic Effects",
    ],
    testStructure: [
      "Analytical problem solving",
      "Motion-based engineering questions",
    ],
    platformFeatures: [
      "Mechanism-based simulation questions",
      "Motion analysis problems",
    ],
    whoShouldEnroll: "Mechanical and robotics engineers, automation engineers",
    price: "₹300/month",
    cta: "Master the science of motion and mechanism design.",
  },
  {
    slug: "fluid-mechanics",
    image: hero7,
    title: "Fluid Mechanics & Machinery",
    displayTitle: "Fluid Mechanics & Machinery",
    subtitle: "",
    hero: "Understand fluid behavior and its engineering applications.",
    heroSub:
      "Fluid Mechanics is essential for designing turbines, pumps, aircraft, and hydraulic systems, and forms the foundation for Computational Fluid Dynamics (CFD).",
    about:
      "Fluid Mechanics deals with the behavior of fluids at rest and in motion. It is essential for designing systems such as turbines, pumps, aircraft, and hydraulic systems. This subject also forms the foundation for Computational Fluid Dynamics (CFD), where fluid flow is analyzed using numerical simulations.",
    masterPoints: [
      "Fluid properties and behavior",
      "Flow dynamics and energy equations",
      "Hydraulic machines and systems",
    ],
    topics: [
      "Fluid Properties and Statics",
      "Fluid Kinematics and Dynamics",
      "Bernoulli's Equation",
      "Flow Measurement Techniques",
      "Boundary Layer Theory",
      "Turbines and Pumps",
      "Compressible Flow",
    ],
    testStructure: ["Numerical-intensive fluid analysis problems"],
    platformFeatures: [
      "CFD-integrated concepts",
      "Real-world fluid system problems",
    ],
    whoShouldEnroll: "Mechanical, aerospace, and hydraulic engineers",
    price: "₹300/month",
    cta: "Develop expertise in fluid systems and flow engineering.",
  },
  {
    slug: "cfd-fea",
    image: hero8,
    title: "CFD & FEA (Simulation Engineering)",
    displayTitle: "Computational Fluid Dynamics (CFD) & Finite Element Analysis (FEA)",
    subtitle: "Computational Fluid Dynamics & Finite Element Analysis",
    hero: "Simulate and analyze engineering systems before manufacturing.",
    heroSub:
      "CFD and FEA are advanced simulation techniques used to analyze fluid flow, structural behavior, and thermal performance — allowing engineers to optimize designs without physical prototyping.",
    about:
      "CFD (Computational Fluid Dynamics) and FEA (Finite Element Analysis) are advanced simulation techniques used to analyze fluid flow, structural behavior, and thermal performance. These tools allow engineers to optimize designs, reduce costs, and improve performance without physical prototyping.",
    masterPoints: [
      "Simulation workflows and methodologies",
      "Mesh generation and solver techniques",
      "Boundary condition setup",
      "Result interpretation and validation",
    ],
    topics: [
      "CFD Fundamentals and Governing Equations",
      "Navier-Stokes Equations",
      "Turbulence Modeling",
      "Discretization Methods",
      "FEA Fundamentals",
      "Meshing Techniques",
      "Structural Analysis",
      "Thermal and Multiphysics Simulation",
      "Post-Processing and Optimization",
    ],
    testStructure: ["Simulation-based MCQs", "MSQs and numerical problems"],
    platformFeatures: [
      "Industry-grade simulation questions",
      "Case-based engineering analysis",
    ],
    whoShouldEnroll: "CAE engineers, simulation learners, advanced mechanical engineers",
    price: "₹300/month",
    cta: "Develop the ability to simulate, analyze, and optimize engineering systems efficiently.",
  },
];

export { mechanicalSubjects };