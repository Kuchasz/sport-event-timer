const fakeContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et mattis enim. Vivamus malesuada sapien mauris, sed dictum metus placerat a. Morbi et sollicitudin sapien. Phasellus fringilla augue a erat imperdiet, sit amet sodales lectus condimentum. Mauris et ante vulputate massa consequat placerat ac tempus lorem. Praesent id est ligula. Vivamus arcu tortor, imperdiet ut venenatis laoreet, condimentum vel velit. Duis urna erat, posuere sit amet quam vitae, bibendum tincidunt lorem. Aliquam pretium mattis mattis. Phasellus volutpat consequat magna, eu sagittis tellus blandit sed. Morbi vulputate, arcu eget pulvinar consectetur, felis felis lacinia risus, at porttitor felis mi ac est. Etiam congue cursus nibh, non ornare elit feugiat vel. Aenean tincidunt magna purus, nec rhoncus tellus ornare in. Suspendisse non iaculis enim. Nullam porta congue accumsan.

Praesent efficitur placerat velit, sed egestas leo bibendum at. Praesent pulvinar nisi mauris, et suscipit dolor iaculis vitae. Donec ut lectus ac justo maximus molestie. Vestibulum ultricies gravida ornare. Vestibulum et velit id libero rhoncus fringilla at vel quam. Nam nibh lacus, aliquet at neque scelerisque, suscipit scelerisque ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed in metus ut arcu dignissim bibendum. Nullam sed magna venenatis, hendrerit libero sit amet, imperdiet odio. Morbi non leo dapibus, tempor mauris quis, auctor massa. Pellentesque eget ex lacinia, consectetur dui sit amet, pellentesque orci. Etiam eget sodales dolor. Duis tincidunt dignissim ullamcorper. Pellentesque vitae dui sed neque luctus egestas sit amet id orci. Nunc pellentesque magna orci, porttitor lacinia nunc ultricies at. Fusce convallis felis tellus, id viverra libero faucibus molestie.

Nam faucibus et odio quis malesuada. In eleifend, justo a mattis tempus, nulla diam congue nunc, eu interdum risus justo eget nibh. Etiam justo dui, vulputate a nulla a, venenatis maximus odio. Proin id aliquet augue. Aliquam non tellus non ligula pretium sagittis. Aenean a elit semper, ullamcorper nulla et, consequat justo. Cras auctor tempor lorem, quis pretium velit sodales a. Fusce lobortis tellus ipsum, non laoreet magna fermentum sit amet. Vivamus posuere laoreet purus ac volutpat. Aliquam placerat laoreet lectus.

Vivamus tellus ipsum, blandit sed ante eget, porttitor rhoncus odio. Nunc vitae arcu tempus lorem mollis laoreet vel in erat. Proin viverra neque id sem condimentum consequat. Suspendisse eu laoreet erat. Donec laoreet ut tortor elementum posuere. Vestibulum ante lorem, tempor et erat sed, tristique pretium odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fringilla tristique magna, et finibus massa eleifend vitae. Proin sed tempus leo. Suspendisse quis rutrum odio. Cras dignissim at risus a faucibus. Vestibulum eu velit id quam mollis dignissim sed ac libero. Proin rutrum, quam sed auctor consequat, diam nisl hendrerit lorem, nec venenatis massa odio et nibh. Mauris tellus enim, luctus et mi et, blandit facilisis neque.

Curabitur eleifend in augue in ultricies. Aliquam feugiat volutpat sapien, nec finibus neque iaculis et. Donec facilisis leo ligula, eget faucibus tellus maximus non. Donec a tortor eget urna pellentesque consequat. Praesent quis magna in neque porta gravida ut vel tellus. Sed pretium sit amet arcu nec varius. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam lacus felis, iaculis eget ultricies in, scelerisque non elit. Etiam euismod metus cursus libero sodales, a commodo ex dictum. Phasellus at neque fermentum, convallis nibh vel, tincidunt lacus. Vivamus id egestas elit, ac posuere nibh. Suspendisse quis nunc ante. Suspendisse arcu est, rutrum a lobortis sed, sollicitudin eget est.`;

export const posts = [
    {
        date: new Date(Date.parse("2021-08-31 11:01")),
        author: "administrator",
        photo: "film-z-prezentacji-trasy.jpg",
        title: "Prezentacja trasy Rura na Kocierz",
        alias: "prezentacja-trasy-rura-na-kocierz-2021",
        content: `Rura na Kocierz coraz bliżej! <br/><br/>Dla niezdecydowanych mamy film, w którym Bartosz opowie Wam o tym, jak dokładnie wygląda trasa, jakie są jej najcięższe punkty, a gdzie ewentualnie można nadgonić. <br/><br/>Zakończ ten sezon w dobrym, górskim stylu wspólnie z czołówką Polskich kolarzy amatorów. 
        <br/><br/>
        Zapisy tutaj 👇
        <br/>
        <a target="_blank" href="https://dostartu.pl/rura-na-kocierz-v6265">https://dostartu.pl/rura-na-kocierz-v6265</a>
        <br/><br/>
        <iframe width="100%" height="480" src="https://www.youtube.com/embed/EYAxH9WYh-I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
        excerpt: "Trasa wyścigu zaprezentowana na filmie, po trasie oprowadzi Was Bartosz"
    },
    {
        date: new Date(Date.parse("2021-09-15 15:28")),
        author: "administrator",
        photo: "nagrody-rura-2021.jpg",
        title: "Czas na nagrody!",
        alias: "nagrody-rura-na-kocierz-2021",
        content: `Rura na Kocierz już za 2 tygodnie! Tym wciąż niezdecydowanym, Krzysiek i Bartosz opowiedzą po krótce jakie nagrody, poza wieczną chwałą i fejmem czekają na zwycięzców 
        <br/><br/>P.S. A to dopiero pierwsza część sagi pt. "Wow! Ale fajne nagrody" 
        <br/><br/>Link do video(wymaga zalogowania na fb): 
        <br/><a target="_blank" href="https://fb.watch/9vvjQLJ0JW/">https://fb.watch/9vvjQLJ0JW</a>
        <br/><br/>Wśród organizatorów, partnerów i sponsorów znajdziecie takie marki jak:
        <br/><a target="_blank" href="https://www.facebook.com/InnergyRacingTeam/">Innergy Racing Team </a>
        <br/><a target="_blank" href="https://www.facebook.com/HotelKocierz/">Kocierz Hotel & SPA </a>
        <br/><a target="_blank" href="https://www.facebook.com/PorabkaGmina/">Gmina Porąbka </a>
        <br/><a target="_blank" href="https://www.facebook.com/pplyson/">Przedsiębiorstwo ŁYSOŃ Tomasz </a>
        <br/><a target="_blank" href="https://www.facebook.com/pasiekalyson/">Pasieka ŁYSOŃ - miód i produkty pszczele </a>
        <br/><a target="_blank" href="https://www.facebook.com/DecathlonPolska/">Decathlon Polska </a>
        <br/><a target="_blank" href="https://www.facebook.com/Eurowafel/">Eurowafel </a>
        <br/><a target="_blank" href="https://www.facebook.com/TrekBielskoBiala">TREK Bielsko-Biała </a>
        <br/><a target="_blank" href="https://www.facebook.com/Eurostempel/">Eurostempel </a>
        <br/><a target="_blank" href="https://www.facebook.com/ADAMEDSmartUP/">ADAMED SmartUP </a>
        <br/><a target="_blank" href="https://www.facebook.com/agropunktstarawies/">Agropunkt - Stara Wieś </a>`,
        excerpt: "Przestawiamy sponsorów rury na kocierz"
    },
    {
        date: new Date(Date.parse("2021-10-03 06:13")),
        author: "administrator",
        photo: "fotografowie-rura-2021.jpg",
        title: "Zdjęcia w wysokiej jakości do pobrania",
        alias: "dostepne-zdjecia-w-wysokiej-jakosci-edycja-2021",
        content: `Dla tych, którzy lubią pamiątki w postaci zdjęć mamy dobrą informację. Na trasie zawodów polowali na was fotografowie. Wszystkie zdjęcia zostają udostępnione do pobrania. Będziecie mogli mogli je wywołać, postawić na kominku i wspominać, gdy zimą za oknem będzie można jeździć pługiem 😅.
        <br/><br/>Strzelali z aparatu Oliwia Kamińska oraz Ignacy Grubka.
        <br/><br/>Link do zdjęć:
        <a href="/zdjecia">https://innergy.cc/zdjecia</a>`,
        excerpt: "Udostępniamy do bezpłatnego pobrania zdjęcia wykonane przez rozstawionych na trasie fotografów"
    },
    {
        date: new Date(Date.parse("2021-11-12 18:09")),
        author: "administrator",
        photo: "rusza-edycja-2022.jpg",
        title: "Rusza edycja 2022!",
        alias: "nowy-sponsor-zawodow-xyz-com",
        content: `Po niewątpliwym sukcesie Rury na Kocierz postanowiliśmy pójść za ciosem: wzorem najlepszych sequeli filmowych będzie mocniej, szybciej i dłużej. Wiemy doskonale, że otwieracie już swoje jaskinie wytopu, odpalając pierwsze plany treningowe z mozołem przygotowywane przez Waszych trenerów 📊.
        <br/><br/>Wobec tego możecie już obrać sobie pierwszy cel na przyszły rok, bo 9 kwietnia 2022 r. widzimy się na otwarciu sezonu! To będzie dwudniowe kolarskie święto. Pierwszego dnia naszej etapówki będziecie mieli do wyboru dwa dystanse: Fun (52 km/ 1120 m) Pro (104 km/ 2340 m).
        <br/><br/>W drugi dzień natomiast zaprosimy was na samotną walkę z czasem: będziecie wtedy mogli odrobić ewentualne straty w klasyfikacji generalnej… lub je powiększyć. Czasówka ma długość 11 km i 380 m przewyższeń. Już teraz możecie zaplanować weekend 9-10 kwietnia wraz ze swoją rodziną.
        <br/><br/>Naprzeciw wychodzi Wam niezawodny <a target="_blank" href="https://www.facebook.com/HotelKocierz">Kocierz Hotel & SPA</a> z ofertą rabatu 15% na pobyt w trakcie naszego szalonego weekendu! 
        <br/><br/>Szczegółowe informacje będziemy sukcesywnie publikować na naszych social mediach, wkrótce ruszą też zapisy. `,
        excerpt:
            "Jeszcze więcej wrażeń, jeszcze większy rozmach. W 2022 widzimy się dwa dni z rzędu! 09.04 - Time Trial, 10.04 - Wyścig ze startu wspólnego"
    }
];
