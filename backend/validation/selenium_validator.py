from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

def validar_muestra_con_selenium(url: str):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(15)

    resultado = {
        "url": url,
        "cta": [],
        "incentivos": [],
        "errores": [],
    }

    try:
        driver.get(url)
        time.sleep(2)

        # Detectar CTAs
        ctas = driver.find_elements(By.CSS_SELECTOR, "a[href]")
        for el in ctas:
            href = el.get_attribute("href")
            texto = el.text.strip()
            if href:
                resultado["cta"].append({
                    "texto": texto,
                    "link": href
                })

        # Buscar incentivos en texto visible
        incentivos = driver.find_elements(By.XPATH, "//*[contains(text(),'$')]")
        for el in incentivos:
            texto = el.text.strip()
            if texto:
                resultado["incentivos"].append(texto)

    except Exception as e:
        resultado["errores"].append(str(e))
    finally:
        driver.quit()

    return resultado
