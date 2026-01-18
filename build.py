import os
import json
from markup import to_html


def make_slide(page, settings):
    return to_html(page), settings


if os.path.isdir("build"):
    os.system("rm -r build")

os.system("mkdir build")
os.system("cp -r _static build/_static")
os.system("cp -r test.html build/")

slides = []
i = 0
while os.path.isfile(f"slides/{i}.html"):
    settings = {"style": "default", "enter_slide": "false", "exit_slide": "false"}
    page = ""
    with open(f"slides/{i}.html") as f:
        for line in f:
            if line[0] == "!":
                key, value = line[1:].split("=", 1)
                settings[key.strip()] = value.strip()
            elif line.strip().startswith("<newslide") and line.strip().endswith(">"):
                params = {}
                raw_params = line.strip()[9:-1].strip()
                if raw_params != "":
                    for p in raw_params.split(" "):
                        name, value = p.split("=")
                        if value[0] in ["'", '"']:
                            assert value[-1] == value[0]
                            value = value[1:-1]
                        params[name] = value
                slides.append(make_slide(page, {**settings, **params}))
                page = ""
            else:
                page += line
        slides.append(make_slide(page, settings))
    i += 1

with open("_template.html") as f:
    t = f.read()

enter_fs = []
exit_fs = []
slide_divs = ""
js = ""
transitions = []
for i, (slide, options) in enumerate(slides):
    enter_fs.append(options['enter_slide'])
    exit_fs.append(options['exit_slide'])
    if "transition" in options:
        transitions.append(f'"{options["transition"]}"')
    else:
        transitions.append("false")

    slide_divs += f"<div class='slide {options['style']}' id='slide{i}' style='display:"
    slide_divs += "block" if i == 0 else "none"
    slide_divs += "'>"
    while "<script>" in slide:
        a, b = slide.split("<script>", 1)
        b, c = b.split("</script>", 1)
        js += to_html(b) + "\n"
        slide = a + "\n" + c
    slide_divs += slide
    slide_divs += "</div>"

slide_divs += (
    "<div class='slide black' id='interact' onclick='this.style.display=\"none\"' style='display:none'>"
    "<center style='margin-top:1vh'>CLICK ON THIS PAGE TO ENABLE AUTOPLAYING</center>"
    "</div>"
)

js += "var enter_fs = [" + ",".join(enter_fs) + "];\n"
js += "var exit_fs = [" + ",".join(exit_fs) + "];\n"
js += "var transitions = [" + ",".join(transitions) + "];\n"

with open("_template.js") as f:
    js += f.read()
js = js.replace("{nslides}", f"{len(slides)}")

t = t.replace("{slide}", slide_divs)
t = t.replace("{js}", js)

with open("build/index.html", "w") as f:
    f.write(t)
