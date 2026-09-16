# paint the page margins dark: put each rendered page on a full-page dark background
import io, sys
from pypdf import PdfReader, PdfWriter, PageObject
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
buf=io.BytesIO(); c=canvas.Canvas(buf,pagesize=letter)
c.setFillColorRGB(0x0F/255,0x14/255,0x20/255); c.rect(0,0,letter[0],letter[1],fill=1,stroke=0); c.save()
bg=PdfReader(io.BytesIO(buf.getvalue())).pages[0]
r=PdfReader(sys.argv[1]); w=PdfWriter()
for pg in r.pages:
    new=PageObject.create_blank_page(width=pg.mediabox.width,height=pg.mediabox.height)
    new.merge_page(bg); new.merge_page(pg); w.add_page(new)
w.add_metadata({'/Title':'MS-2000 Parts and Materials','/Author':'NAW Games'})
w.write(sys.argv[2]); print(len(r.pages),'pages')
