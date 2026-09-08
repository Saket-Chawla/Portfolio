import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)

def build_pdf(filename):
    # Page setup: Letter size (612 x 792 pt), 36pt (0.5 inch) margins
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    printable_width = letter[0] - 72 # 540 pt

    styles = getSampleStyleSheet()

    name_style = ParagraphStyle(
        'HeaderName',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=22,
        leading=24,
        alignment=1, # Center
        textColor=colors.black,
        spaceAfter=4
    )

    contact_style = ParagraphStyle(
        'HeaderContact',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.5,
        leading=12,
        alignment=1, # Center
        textColor=colors.black,
        spaceAfter=8
    )

    section_heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=11,
        leading=13,
        textColor=colors.black,
        spaceBefore=6,
        spaceAfter=1
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.5,
        leading=12.5,
        textColor=colors.black,
        alignment=4 # Justified
    )

    entry_left_bold = ParagraphStyle(
        'EntryLeftBold',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=10,
        leading=12.5,
        textColor=colors.black
    )

    entry_left_italic = ParagraphStyle(
        'EntryLeftItalic',
        parent=styles['Normal'],
        fontName='Times-Italic',
        fontSize=9.5,
        leading=12,
        textColor=colors.black
    )

    entry_right_bold = ParagraphStyle(
        'EntryRightBold',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=10,
        leading=12.5,
        alignment=2, # Right
        textColor=colors.black
    )

    entry_right_italic = ParagraphStyle(
        'EntryRightItalic',
        parent=styles['Normal'],
        fontName='Times-Italic',
        fontSize=9.5,
        leading=12,
        alignment=2, # Right
        textColor=colors.black
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.5,
        leading=12.5,
        textColor=colors.black,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=2
    )

    story = []

    # --- HEADER ---
    story.append(Paragraph("Saket Chawla", name_style))
    
    contact_text = (
        '<a href="tel:+919878841320" color="black">+91-9878841320</a> &nbsp;|&nbsp; '
        '<a href="mailto:chawlasaket4271@gmail.com" color="black">chawlasaket4271@gmail.com</a> &nbsp;|&nbsp; '
        '<a href="https://linkedin.com/in/wakeupsaket" color="black">linkedin.com/in/wakeupsaket</a> &nbsp;|&nbsp; '
        '<a href="https://github.com/Saket-Chawla" color="black">github.com/Saket-Chawla</a> &nbsp;|&nbsp; '
        '<a href="https://wakeupsaket.vercel.app" color="black">wakeupsaket.vercel.app</a>'
    )
    story.append(Paragraph(contact_text, contact_style))

    def add_section_header(title):
        story.append(Paragraph(f"<b>{title}</b>", section_heading_style))
        story.append(HRFlowable(width="100%", thickness=0.75, color=colors.black, spaceBefore=1, spaceAfter=5))

    # --- SUMMARY ---
    add_section_header("SUMMARY")
    summary_p = (
        "Full-stack developer with a broad programming foundation spanning React/Next.js frontend development, "
        "Python backend and data work, and applied Generative AI (LangChain, Google Gemini). Experience building and "
        "deploying complete web applications end-to-end, from UI to API integration to production deployment. Currently "
        "pursuing an MCA specializing in Cybersecurity. Seeking entry-level Software Developer / Full-Stack roles."
    )
    story.append(Paragraph(summary_p, body_style))

    # --- EDUCATION ---
    add_section_header("EDUCATION")
    
    edu1_data = [
        [Paragraph("Amity University Online", entry_left_bold), Paragraph("Jul 2026 -- Present", entry_right_bold)],
        [Paragraph("Master of Computer Applications (MCA) -- Specialization in Cybersecurity", entry_left_italic), Paragraph("India", entry_right_italic)]
    ]
    t_edu1 = Table(edu1_data, colWidths=[380, 160])
    t_edu1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    story.append(t_edu1)
    story.append(Spacer(1, 4))

    edu2_data = [
        [Paragraph("DAV College, Amritsar", entry_left_bold), Paragraph("Oct 2022 -- Jul 2025", entry_right_bold)],
        [Paragraph("Bachelor of Computer Applications (BCA)", entry_left_italic), Paragraph("India", entry_right_italic)]
    ]
    t_edu2 = Table(edu2_data, colWidths=[380, 160])
    t_edu2.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    story.append(t_edu2)

    # --- PROJECTS ---
    add_section_header("PROJECTS")

    # Project 1: TaskFlow
    proj1_left = "<b>TaskFlow -- Task Management App</b> | <b>React, Vite, Tailwind CSS, shadcn/ui, Framer Motion</b>"
    proj1_right = "Mar 2026 -- Apr 2026"
    t_proj1 = Table([[Paragraph(proj1_left, entry_left_bold), Paragraph(proj1_right, entry_right_bold)]], colWidths=[415, 125])
    t_proj1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_proj1)
    story.append(Paragraph("&bull;&nbsp;&nbsp;Engineered a full task management workflow (create, edit, delete, instant search, and a progress-tracking dashboard) from scratch using React and Vite.", bullet_style))
    story.append(Paragraph("&bull;&nbsp;&nbsp;Designed a persistent dark/light mode system and a reusable shadcn/ui + Tailwind CSS component library, cutting UI rebuild time on new features.", bullet_style))
    story.append(Spacer(1, 4))

    # Project 2: JobFit AI
    proj2_left = "<b>JobFit AI -- Resume Analyzer</b> | <b>Python, LangChain, Google Gemini, Streamlit</b>"
    proj2_right = "Jan 2026 -- Feb 2026"
    t_proj2 = Table([[Paragraph(proj2_left, entry_left_bold), Paragraph(proj2_right, entry_right_bold)]], colWidths=[415, 125])
    t_proj2.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_proj2)
    story.append(Paragraph("&bull;&nbsp;&nbsp;Architected a full-stack Generative AI application that scores resumes against job descriptions using Google Gemini 2.5 and LangChain, combining semantic matching with ATS keyword analysis.", bullet_style))
    story.append(Paragraph("&bull;&nbsp;&nbsp;Engineered the prompt pipeline to replicate real ATS scoring logic, and deployed it on Streamlit Cloud with secure API key handling and production-grade error handling.", bullet_style))
    story.append(Spacer(1, 4))

    # Project 3: Langagraph
    proj3_left = "<b>Langagraph: Graph &amp; Agent Visualizer</b> | <b>HTML5, CSS3, SVG</b>"
    proj3_right = "Dec 2025 -- Jan 2026"
    t_proj3 = Table([[Paragraph(proj3_left, entry_left_bold), Paragraph(proj3_right, entry_right_bold)]], colWidths=[415, 125])
    t_proj3.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_proj3)
    story.append(Paragraph("&bull;&nbsp;&nbsp;Built an interactive browser-based graph simulation engine supporting grid, ring, and star network topologies with real-time agent-flow animations, rendered entirely in native SVG.", bullet_style))
    story.append(Paragraph("&bull;&nbsp;&nbsp;Implemented Dijkstra's Shortest Path Algorithm from scratch to animate optimal routing in real time across weighted directed graphs.", bullet_style))

    # --- TECHNICAL SKILLS ---
    add_section_header("TECHNICAL SKILLS")
    skills = [
        ("Programming Languages:", "Python, HTML5, CSS3, SQL"),
        ("Web & Full-Stack Development:", "React, Next.js, Vite, Tailwind CSS, FastAPI, Git, GitHub"),
        ("Generative AI & LLMs:", "LangChain, OpenAI API, Google Gemini API, RAG, Prompt Engineering"),
        ("Data & Visualization:", "Pandas, NumPy, Matplotlib"),
        ("Tools & Platforms:", "Jupyter Notebook, Streamlit Cloud, Vercel, Postman")
    ]
    for label, val in skills:
        p_text = f"<b>{label}</b> {val}"
        story.append(Paragraph(p_text, ParagraphStyle('SkillLine', parent=body_style, leading=13.5, spaceAfter=2)))

    # --- CERTIFICATIONS ---
    add_section_header("CERTIFICATIONS")
    cert_text = "<b>Artificial Intelligence and Machine Learning</b> -- MITS Academy -- Jul 2025 -- Dec 2025"
    story.append(Paragraph(cert_text, ParagraphStyle('CertLine', parent=body_style, leading=13)))

    doc.build(story)
    print("PDF built successfully:", filename)

if __name__ == '__main__':
    target_path = os.path.join('assets', 'pdf', 'Saket_Chawla_Resume.pdf')
    build_pdf(target_path)
