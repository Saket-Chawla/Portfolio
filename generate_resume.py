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

    # --- PROFESSIONAL SUMMARY ---
    add_section_header("PROFESSIONAL SUMMARY")
    summary_p = (
        "Software Developer skilled in React, Next.js, JavaScript, Python, and Generative AI integrations (LangChain, Gemini API). "
        "Experienced in building modern frontend interfaces, developing REST APIs, and deploying full-stack web applications on Vercel "
        "and Streamlit Cloud. Currently pursuing an MCA in Cybersecurity while seeking entry-level Software Developer or Full-Stack Engineer roles."
    )
    story.append(Paragraph(summary_p, body_style))

    # --- TECHNICAL SKILLS ---
    add_section_header("TECHNICAL SKILLS")
    skills = [
        ("Languages:", "Python, JavaScript, SQL, HTML5, CSS3"),
        ("Frontend & Web:", "React, Next.js, Vite, Tailwind CSS, REST APIs"),
        ("Backend & AI Frameworks:", "FastAPI, LangChain, Google Gemini API, OpenAI API"),
        ("Developer Tools:", "Git, GitHub, Vercel, Streamlit Cloud, AntiGravity, Claude Code, VS Code")
    ]
    for label, val in skills:
        p_text = f"<b>{label}</b> {val}"
        story.append(Paragraph(p_text, ParagraphStyle('SkillLine', parent=body_style, leading=13.5, spaceAfter=2)))

    # --- PROJECTS ---
    add_section_header("PROJECTS")

    # Project 1: ResuFlex AI
    proj1_left = "<b>ResuFlex AI</b> | <b>Python, LangChain, Google Gemini, Streamlit</b>"
    proj1_right = '<a href="https://resuflex-ai.vercel.app" color="blue">resuflex-ai.vercel.app</a>'
    t_proj1 = Table([[Paragraph(proj1_left, entry_left_bold), Paragraph(proj1_right, entry_right_bold)]], colWidths=[380, 160])
    t_proj1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_proj1)
    story.append(Paragraph("&bull;&nbsp;&nbsp;Developed an AI-driven resume optimization application that analyzes resume content and provides structured ATS match scoring against targeted job descriptions.", bullet_style))
    story.append(Paragraph("&bull;&nbsp;&nbsp;Engineered prompt and parser pipelines using Google Gemini API and LangChain to identify technical skill gaps and recommend targeted phrasing enhancements.", bullet_style))
    story.append(Paragraph("&bull;&nbsp;&nbsp;Deployed an interactive web interface on Streamlit Cloud with secure API key environment management and input validation.", bullet_style))
    story.append(Spacer(1, 4))

    # Project 2: JobFit AI
    proj2_left = "<b>JobFit AI – Resume Analyzer</b> | <b>Python, LangChain, Google Gemini, Streamlit</b>"
    proj2_right = '<a href="https://jobfitapp.streamlit.app" color="blue">jobfitapp.streamlit.app</a>'
    t_proj2 = Table([[Paragraph(proj2_left, entry_left_bold), Paragraph(proj2_right, entry_right_bold)]], colWidths=[380, 160])
    t_proj2.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_proj2)
    story.append(Paragraph("&bull;&nbsp;&nbsp;Built a full-stack Generative AI tool that evaluates resumes against job listings using semantic embedding evaluation alongside ATS keyword density checks.", bullet_style))
    story.append(Paragraph("&bull;&nbsp;&nbsp;Configured custom prompt workflows with LangChain to generate tailored actionable feedback reports for job applicants.", bullet_style))
    story.append(Paragraph("&bull;&nbsp;&nbsp;Published the app to Streamlit Cloud, setting up robust secret management and production error handling.", bullet_style))
    story.append(Spacer(1, 4))

    # Project 3: TaskFlow
    proj3_left = "<b>TaskFlow – Task Management App</b> | <b>React, JavaScript, Vite, Tailwind CSS</b>"
    proj3_right = '<a href="https://taskflow-pink-six.vercel.app" color="blue">taskflow-pink-six.vercel.app</a>'
    t_proj3 = Table([[Paragraph(proj3_left, entry_left_bold), Paragraph(proj3_right, entry_right_bold)]], colWidths=[380, 160])
    t_proj3.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_proj3)
    story.append(Paragraph("&bull;&nbsp;&nbsp;Created a modern responsive task management system featuring dynamic search, real-time status filtering, and task lifecycle tracking.", bullet_style))
    story.append(Paragraph("&bull;&nbsp;&nbsp;Implemented persistent dark/light theme switching and built a custom reusable visual component set with Tailwind CSS.", bullet_style))

    # --- EDUCATION ---
    add_section_header("EDUCATION")
    
    edu1_data = [
        [Paragraph("Amity University Online &mdash; Master of Computer Applications (MCA), Cybersecurity", entry_left_bold), Paragraph("Jul 2026 &ndash; Present", entry_right_bold)],
    ]
    t_edu1 = Table(edu1_data, colWidths=[400, 140])
    t_edu1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    story.append(t_edu1)

    edu2_data = [
        [Paragraph("DAV College, Amritsar &mdash; Bachelor of Computer Applications (BCA)", entry_left_bold), Paragraph("Oct 2022 &ndash; Jul 2025", entry_right_bold)],
    ]
    t_edu2 = Table(edu2_data, colWidths=[400, 140])
    t_edu2.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    story.append(t_edu2)

    edu3_data = [
        [Paragraph("DAV International School, Amritsar &mdash; Senior Secondary (12th Grade)", entry_left_bold), Paragraph("Completed 2022", entry_right_bold)],
    ]
    t_edu3 = Table(edu3_data, colWidths=[400, 140])
    t_edu3.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    story.append(t_edu3)

    # --- CERTIFICATIONS ---
    add_section_header("CERTIFICATIONS")
    cert_text = "<b>Artificial Intelligence and Machine Learning Certificate</b> &mdash; MITS Academy (Jul 2025 &ndash; Dec 2025)"
    story.append(Paragraph(cert_text, ParagraphStyle('CertLine', parent=body_style, leading=13)))

    doc.build(story)
    print("PDF built successfully:", filename)

if __name__ == '__main__':
    target_path = os.path.join('assets', 'pdf', 'Saket_Chawla_Resume.pdf')
    build_pdf(target_path)
