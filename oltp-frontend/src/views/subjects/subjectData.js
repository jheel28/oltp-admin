import hero1 from "assets/img/hero/L1.jpg";
import hero2 from "assets/img/hero/L2.jpg";
import hero3 from "assets/img/hero/L3.jpg";
import hero4 from "assets/img/hero/L4.jpg";
import hero5 from "assets/img/hero/L5.jpg";
import hero6 from "assets/img/hero/L6.jpg";
import hero7 from "assets/img/hero/L7.jpg";
import hero8 from "assets/img/hero/L8.jpg";
import T1 from "assets/img/hero/T1.jpg";
import T2 from "assets/img/hero/T2.jpg";
import T3 from "assets/img/hero/T3.jpg";
import T4 from "assets/img/hero/T4.jpg";
import T5 from "assets/img/hero/T5.jpg";

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

const featuredSubjects = [
  {
    slug: "physics-of-design",
    image: T1,
    title: "Physics of Design",
    displayTitle: "Physics of Design",
    subtitle: "",
    hero: "Understand the fundamental physics behind engineering systems and product design.",
    heroSub:
      "Physics of Design focuses on applying core physical principles to engineering design and system behavior — crucial for robotics, aerospace, and advanced product development.",
    about:
      "Physics of Design focuses on applying core physical principles to engineering design and system behavior. It goes beyond theoretical physics and emphasizes how forces, energy, motion, and material interactions influence real-world products and mechanisms. This subject is crucial for engineers working in robotics, aerospace, automotive systems, and advanced product development, where design decisions must be backed by strong physical understanding.",
    masterPoints: [
      "Application of mechanics in design systems",
      "Energy interactions and system behavior",
      "Motion and force optimization",
      "Physical constraints in product design",
      "Analytical thinking for engineering applications",
    ],
    topics: [
      "Classical Mechanics in Design",
      "Energy Methods and Work Principles",
      "Kinematics in Mechanical Systems",
      "Dynamics of Rigid Bodies",
      "Vibrations and System Stability",
      "Contact Mechanics and Friction",
      "Scaling Laws in Engineering Design",
      "Physical Modeling and Prototyping",
    ],
    testStructure: [
      "Concept-based MCQs",
      "Multi-concept analytical MSQs",
      "Numerical problems focused on design scenarios",
      "Application-based problem solving",
    ],
    platformFeatures: [
      "Advanced concept-driven learning",
      "Research-oriented problem sets",
      "Real-world application scenarios",
      "Performance analytics and insights",
    ],
    whoShouldEnroll:
      "Engineering students (Mechanical, Robotics, Aerospace), Product designers and innovators",
    price: "₹300/month",
    cta: "Develop the ability to design systems grounded in fundamental physics.",
  },
  {
    slug: "origami-art-in-robotics",
    image: T2,
    title: "Origami Art in Robotics",
    displayTitle: "Origami Art in Robotics",
    subtitle: "",
    hero: "Merge art, geometry, and engineering to build adaptive robotic systems.",
    heroSub:
      "Explore the emerging field of origami in robotics — combining folding techniques with engineering design to create compact, flexible, and deployable structures.",
    about:
      "Origami in Robotics is an emerging interdisciplinary field that combines folding techniques with engineering design to create compact, flexible, and deployable structures. This field is widely used in soft robotics, space structures, biomedical devices, and deployable mechanisms, where traditional rigid systems are not feasible.",
    masterPoints: [
      "Origami-based structural design",
      "Folding kinematics and transformations",
      "Deployable and reconfigurable systems",
      "Soft robotics concepts",
      "Geometry-driven engineering design",
    ],
    topics: [
      "Basics of Origami Geometry",
      "Folding Patterns (Miura-ori, Waterbomb, etc.)",
      "Kinematics of Folding Structures",
      "Deployable Mechanisms",
      "Soft Robotics Applications",
      "Material Behavior in Folding",
      "Computational Origami Design",
      "Applications in Aerospace and Biomedical Fields",
    ],
    testStructure: [
      "Conceptual MCQs",
      "Geometry-based MSQs",
      "Numerical problems related to folding mechanics",
      "Design-oriented case studies",
    ],
    platformFeatures: [
      "Advanced concept-driven learning",
      "Research-oriented problem sets",
      "Real-world application scenarios",
      "Performance analytics and insights",
    ],
    whoShouldEnroll:
      "Engineering students, Robotics enthusiasts, Designers interested in deployable systems",
    price: "₹300/month",
    cta: "Explore the future of robotics through innovative folding-based design.",
  },
  {
    slug: "mathematics",
    image: T3,
    title: "Mathematics",
    displayTitle: "Mathematics",
    subtitle: "Advanced Mathematics for Engineering & Research",
    hero: "Build the analytical foundation for simulation, modeling, and innovation.",
    heroSub:
      "Focused on advanced applications in engineering, robotics, and computational systems — emphasizing problem-solving, modeling, and analytical thinking.",
    about:
      "Mathematics in this platform is focused on advanced applications in engineering, robotics, and computational systems. It emphasizes problem-solving, modeling, and analytical thinking required for simulations and research. This subject supports domains like CFD, FEA, AI, control systems, and optimization.",
    masterPoints: [
      "Mathematical modeling",
      "Analytical problem solving",
      "Computational methods",
      "Optimization techniques",
      "Applied mathematics in engineering",
    ],
    topics: [
      "Advanced Calculus",
      "Differential Equations",
      "Linear Algebra",
      "Vector Calculus",
      "Numerical Methods",
      "Optimization Techniques",
      "Probability and Statistics",
      "Mathematical Modeling",
    ],
    testStructure: [
      "Conceptual MCQs",
      "Multi-step analytical MSQs",
      "Numerical simulation-based problems",
    ],
    platformFeatures: [
      "Advanced concept-driven learning",
      "Research-oriented problem sets",
      "Real-world application scenarios",
      "Performance analytics and insights",
    ],
    whoShouldEnroll: "Engineering students, Research enthusiasts, Learners aiming for R&D",
    price: "₹300/month",
    cta: "Strengthen your mathematical thinking for advanced engineering applications.",
  },
  {
    slug: "flexure-joints-and-mechanisms",
    image: T4,
    title: "Flexure Joints and Mechanisms",
    displayTitle: "Flexure Joints & Mechanisms",
    subtitle: "",
    hero: "Design precision systems without traditional joints.",
    heroSub:
      "Flexure mechanisms use elastic deformation to achieve motion, eliminating traditional joints for zero backlash and high precision in MEMS, robotics, and biomedical instruments.",
    about:
      "Flexure mechanisms use elastic deformation to achieve motion, eliminating the need for traditional mechanical joints. These systems are widely used in precision engineering, MEMS devices, robotics, and biomedical instruments. They offer advantages such as zero backlash, high precision, and minimal maintenance.",
    masterPoints: [
      "Design of compliant mechanisms",
      "Elastic deformation principles",
      "Precision motion systems",
      "Mechanism optimization",
      "Material behavior in flexure systems",
    ],
    topics: [
      "Fundamentals of Flexure Mechanics",
      "Compliant Mechanism Design",
      "Beam-Based Flexure Systems",
      "Stress Analysis in Flexures",
      "Precision Engineering Applications",
      "Micro and Nano Mechanisms",
      "Design Optimization",
      "Applications in Robotics and Instruments",
    ],
    testStructure: [
      "Concept-based MCQs",
      "Design-oriented MSQs",
      "Numerical problems on deformation and stress",
      "Case-based engineering problems",
    ],
    platformFeatures: [
      "Advanced concept-driven learning",
      "Research-oriented problem sets",
      "Real-world application scenarios",
      "Performance analytics and insights",
    ],
    whoShouldEnroll:
      "Mechanical and robotics engineers, Precision engineering students, MEMS designers",
    price: "₹300/month",
    cta: "Design high-precision systems with advanced mechanism concepts.",
  },
  {
    slug: "chemistry-for-materials-science",
    image: T5,
    title: "Chemistry for Materials Science",
    displayTitle: "Chemistry for Materials Science",
    subtitle: "",
    hero: "Understand materials at the molecular level to engineer better products.",
    heroSub:
      "Master the chemical principles governing material properties and performance — essential for innovating in aerospace, automotive, electronics, and biomedical fields.",
    about:
      "This subject focuses on the chemical principles governing material properties, behavior, and performance. It is essential for developing new materials used in aerospace, automotive, electronics, and biomedical applications. Understanding material chemistry enables engineers to design stronger, lighter, and more efficient systems.",
    masterPoints: [
      "Material composition and structure",
      "Chemical bonding and properties",
      "Corrosion and degradation",
      "Advanced material selection",
      "Material behavior in engineering applications",
    ],
    topics: [
      "Atomic Structure and Bonding",
      "Crystal Structures and Defects",
      "Polymers, Ceramics, and Composites",
      "Corrosion and Surface Chemistry",
      "Thermodynamics of Materials",
      "Nanomaterials and Advanced Materials",
      "Material Processing Techniques",
      "Applications in Engineering Systems",
    ],
    testStructure: [
      "Concept-based MCQs",
      "Analytical MSQs",
      "Numerical and application-based questions",
    ],
    platformFeatures: [
      "Advanced concept-driven learning",
      "Research-oriented problem sets",
      "Real-world application scenarios",
      "Performance analytics and insights",
    ],
    whoShouldEnroll:
      "Materials science students, Aerospace and automotive engineers, Interdisciplinary learners",
    price: "₹300/month",
    cta: "Develop the knowledge to innovate with advanced materials.",
  },
];

export { mechanicalSubjects, featuredSubjects };