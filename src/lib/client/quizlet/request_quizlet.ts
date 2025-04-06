export function gen_url(id: string): string {
    return `https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=${id}&filters%5BstudiableContainerType%5D=1&perPage=100&page=1`
}

export function parse_url(url: string): string | null {
    const match = url.match(/quizlet\.com\/(\d+)\//);
    if (match && match[1]) {
        return match[1];
    }

    return null;
}

// Would be nice to use Zod Schema
/*export async function get(id: string): Promise<any | null> {
    try {
        const resp = await fetch(gen_url(id), {
            "headers": {*/
//                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                /*"accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "priority": "u=0, i",
                "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "qi5=egym3zvask13%3Aa07pZ9TrPdfogY8xG5Xg; fs=snsixr; sp=88ebf6c4-aa82-4500-bfb5-b4899831ec63; qmeasure__persistence=%7B%22118%22%3A%2200010000%22%7D; qtkn=jGcuzkWdMq9VaJeHChNSfv; _pxhd=76c834625beafbf1d73c14d995c2b824a4cb655aeb6827c5003f718104c158ca:b33f1f48-1262-11f0-a17f-7e50b802204e; _cfuvid=tYgHqVJkXuLBcBEd0mAUU_Cmi7jiwd.e8_aCrtqqTh8-1743887557602-0.0.1.1-604800000; _gcl_au=1.1.92811767.1743887561; _gid=GA1.2.1870601315.1743887562; OTGPPConsent=DBABBg~BUoAAAKA.QA; session_landing_page=Homepage%2Findex; pxcts=b6578a93-1262-11f0-a1a8-f947ad215c5e; _pxvid=b33f1f48-1262-11f0-a17f-7e50b802204e; afUserId=f999e9a5-ddc8-45c4-bcb9-cd56b4877599-p; AF_SYNC=1743887562923; search_placement=global_nav; chr_3p_state_logged=true; _sharedID=4faa4025-25b2-4951-8e58-b9fa1ab51629; _sharedID_cst=YCxuLPQsfA%3D%3D; _lr_env_src_ats=false; _cc_id=4d418ccd887b9d9e216285819e4ab42; panoramaId_expiry=1744492384580; panoramaId=25344ba584c6a5684ab928c9a914185ca02c577f19740de8fc56edbcd00a2872; panoramaIdType=panoDevice; _au_1d=AU1D-0100-001743887585-LK5GQWS6-FFCI; _lr_sampling_rate=100; _li_dcdm_c=.quizlet.com; _lc2_fpi=f47ef1359855--01jr3wszv7tr8hb5xya40vb98a; _lc2_fpi_meta=%7B%22w%22%3A1743887597416%7D; _pubcid=054181c9-64dd-4d71-999d-69becb277166; _pubcid_cst=zix7LPQsHA%3D%3D; cf_clearance=HDF8qgCyVZHmlITqrOyKcfacFrZnnwE5pGtvoaz13uY-1743889904-1.2.1.1-DW8KHHU2vldbxwdB1a0.x7m5IIgrUl9oqsWMbVjqxo_bod8EC9rkmf2cVm2N8toKDJ_1mPnfwgBI6qcs6MvBqNqilSvVa9Z3jgffqUrGzXNvv.X8zqLeJ4htCqEtXaaRwqzH66AS5GZNyq7Ts3t9Ke5ALRxvoBz_u9vVkf62fF9xvP.rn8wmnITiaeZdyIRvDXpasnijcyV6oER3L9SVZOfqnaHRs1xfp1_BFi2ODSxENWVcGufYl.N.DZeo6iwErlqlRmqTVWYUkcvovbLVLMwDVKzJjqInwtAGemBmS_j9x4wyO2GwV1wWvxbnw_RaDPCJC4eL1xawPW6fCVDxLxUosGKTBRLYvz3T2mmgDi4; _au_1d=AU1D-0100-001743887585-LK5GQWS6-FFCI; _lr_geo_location=US; _lr_geo_location_state=OR; __gads=ID=022d1a6e2699f4dd:T=1743887586:RT=1743890326:S=ALNI_MbnAQsuG1qyztoJZo3D6uK1x6GmKA; __gpi=UID=000010890c0ead16:T=1743887586:RT=1743890326:S=ALNI_MaUv7PKP35psu3gnU_2WhrykKMj0w; __eoi=ID=fae70b91a398c80d:T=1743887586:RT=1743890326:S=AA-AfjZT3z9O9vhKxpEhjYd1t-kJ; search_session=%7B%22search_session_id%22%3A%22-190471780494989168767f1a7a268a91%22%2C%22query%22%3A%22history%22%2C%22version%22%3A%221.1.1%22%2C%22platform%22%3A%22WEB%22%2C%22depth%22%3A1%2C%22target_object_id%22%3A255972996%2C%22target_object_id_string%22%3A%22255972996%22%2C%22target_object_type%22%3A%22QSet%22%2C%22source_model_id%22%3Anull%2C%22source_model_type%22%3Anull%7D; _ga=GA1.1.436816464.1743887562; connectId=%7B%22puid%22%3A%2200c617d468dd1ff0c6438c9018ec2a0ea99d686bf676c9dfd60b21b3d2cd8e4b%22%2C%22vmuid%22%3A%22ZZRZ5Z0U47iytFDestXgOh9_ym_0KSRAh06fHmhJpI-lzkBfbMyf6iga6kzs63_yg3gJrZIBUMUkvJBHdyNsqw%22%2C%22connectid%22%3A%22ZZRZ5Z0U47iytFDestXgOh9_ym_0KSRAh06fHmhJpI-lzkBfbMyf6iga6kzs63_yg3gJrZIBUMUkvJBHdyNsqw%22%2C%22connectId%22%3A%22ZZRZ5Z0U47iytFDestXgOh9_ym_0KSRAh06fHmhJpI-lzkBfbMyf6iga6kzs63_yg3gJrZIBUMUkvJBHdyNsqw%22%2C%22ttl%22%3A86400000%2C%22lastSynced%22%3A1743887584159%2C%22lastUsed%22%3A1743890343597%7D; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Apr+05+2025+14%3A59%3A04+GMT-0700+(Pacific+Daylight+Time)&version=202310.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=6abaac27-b1e4-48f0-9894-de8de0f17489&interactionCount=1&landingPath=NotLandingPage&GPPCookiesCount=1&groups=C0001%3A1%2CN01%3A1%2CC0002%3A1%2CC0004%3A1&AwaitingReconsent=false; pbjs-unifiedid=%7B%22TDID%22%3A%224bc791eb-83fd-4a4d-9b16-12f7b6ce79e6%22%2C%22TDID_LOOKUP%22%3A%22FALSE%22%2C%22TDID_CREATED_AT%22%3A%222025-04-05T21%3A13%3A17%22%7D; pbjs-unifiedid_cst=zix7LPQsHA%3D%3D; cto_bundle=irwfFV9JR0FSZTlkbDlBSzY1JTJGNFNQakRyUFNiU2tFYlY4Q0Z2JTJCdWdvdGJKb0MwNkg3cmxuWUtTMlBuN2U4bnVQMXlOTUtEeU1WJTJGQ1JISzkwZGhCc1VEVkxid1lYbkw1VTdTcExGJTJCJTJGZjZ4Y1RkZEszbXk3SzFBcjNGdGdQSnB1MWw2Z0M; _sp_id.424b=964167e7-9533-424c-943e-b259b7003778.1733015008.4.1743892284.1743890374.ddf54dd9-ed51-4bca-bd75-89f458a7fdf1.4d8c3085-461a-4e32-9af1-803dc18e8d1e.2f7efc3d-adf0-4e0d-ad1e-c27238f6d1b4.1743892274929.2; _ga_BGGDEZ0S21=GS1.1.1743892597.3.0.1743892597.0.0.0; _ga_VG8TWT63ZN=GS1.1.1743892597.3.0.1743892597.0.0.0; _ga_FVWZ0RM4DH=GS1.1.1743892597.3.0.1743892597.60.0.0; app_session_id=3ba2277f-2e0d-45be-82f4-8920f7a5174c; __cf_bm=v811K9ca7K1EPcDsizbkfxQ2.s1RVgT2uB5gdDckPmw-1743897344-1.0.1.1-wqCTOp8MZo4DgtJZnz.vyxsz67p85gxEMzkrAEOZy5Aalm8Ne3Cm6L2UHC.GZ8WwOHhMhc6ZqqRG18ItGKy3gK1CZY8JicJ8itukrQMjzgY"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        })
        console.log(await resp.text())
        return await resp.json()
    } catch {
        console.log("Failed request quizlet")
        return null
    }
}*/

export function get_cards(json: string): QuizCard[] {
    let data: any = JSON.parse(json)

    const cards: QuizCard[] = [];

    const cardJson: any[] = data.responses[0].models.studiableItem
    cardJson.forEach((item) => {
        const question = item.cardSides[0].media[0].plainText
        const answer = item.cardSides[0].media[0].plainText

        cards.push({ question: question, answer: answer })
    })

    return cards
}
