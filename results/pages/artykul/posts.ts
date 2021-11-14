const fakeContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et mattis enim. Vivamus malesuada sapien mauris, sed dictum metus placerat a. Morbi et sollicitudin sapien. Phasellus fringilla augue a erat imperdiet, sit amet sodales lectus condimentum. Mauris et ante vulputate massa consequat placerat ac tempus lorem. Praesent id est ligula. Vivamus arcu tortor, imperdiet ut venenatis laoreet, condimentum vel velit. Duis urna erat, posuere sit amet quam vitae, bibendum tincidunt lorem. Aliquam pretium mattis mattis. Phasellus volutpat consequat magna, eu sagittis tellus blandit sed. Morbi vulputate, arcu eget pulvinar consectetur, felis felis lacinia risus, at porttitor felis mi ac est. Etiam congue cursus nibh, non ornare elit feugiat vel. Aenean tincidunt magna purus, nec rhoncus tellus ornare in. Suspendisse non iaculis enim. Nullam porta congue accumsan.

Praesent efficitur placerat velit, sed egestas leo bibendum at. Praesent pulvinar nisi mauris, et suscipit dolor iaculis vitae. Donec ut lectus ac justo maximus molestie. Vestibulum ultricies gravida ornare. Vestibulum et velit id libero rhoncus fringilla at vel quam. Nam nibh lacus, aliquet at neque scelerisque, suscipit scelerisque ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed in metus ut arcu dignissim bibendum. Nullam sed magna venenatis, hendrerit libero sit amet, imperdiet odio. Morbi non leo dapibus, tempor mauris quis, auctor massa. Pellentesque eget ex lacinia, consectetur dui sit amet, pellentesque orci. Etiam eget sodales dolor. Duis tincidunt dignissim ullamcorper. Pellentesque vitae dui sed neque luctus egestas sit amet id orci. Nunc pellentesque magna orci, porttitor lacinia nunc ultricies at. Fusce convallis felis tellus, id viverra libero faucibus molestie.

Nam faucibus et odio quis malesuada. In eleifend, justo a mattis tempus, nulla diam congue nunc, eu interdum risus justo eget nibh. Etiam justo dui, vulputate a nulla a, venenatis maximus odio. Proin id aliquet augue. Aliquam non tellus non ligula pretium sagittis. Aenean a elit semper, ullamcorper nulla et, consequat justo. Cras auctor tempor lorem, quis pretium velit sodales a. Fusce lobortis tellus ipsum, non laoreet magna fermentum sit amet. Vivamus posuere laoreet purus ac volutpat. Aliquam placerat laoreet lectus.

Vivamus tellus ipsum, blandit sed ante eget, porttitor rhoncus odio. Nunc vitae arcu tempus lorem mollis laoreet vel in erat. Proin viverra neque id sem condimentum consequat. Suspendisse eu laoreet erat. Donec laoreet ut tortor elementum posuere. Vestibulum ante lorem, tempor et erat sed, tristique pretium odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fringilla tristique magna, et finibus massa eleifend vitae. Proin sed tempus leo. Suspendisse quis rutrum odio. Cras dignissim at risus a faucibus. Vestibulum eu velit id quam mollis dignissim sed ac libero. Proin rutrum, quam sed auctor consequat, diam nisl hendrerit lorem, nec venenatis massa odio et nibh. Mauris tellus enim, luctus et mi et, blandit facilisis neque.

Curabitur eleifend in augue in ultricies. Aliquam feugiat volutpat sapien, nec finibus neque iaculis et. Donec facilisis leo ligula, eget faucibus tellus maximus non. Donec a tortor eget urna pellentesque consequat. Praesent quis magna in neque porta gravida ut vel tellus. Sed pretium sit amet arcu nec varius. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam lacus felis, iaculis eget ultricies in, scelerisque non elit. Etiam euismod metus cursus libero sodales, a commodo ex dictum. Phasellus at neque fermentum, convallis nibh vel, tincidunt lacus. Vivamus id egestas elit, ac posuere nibh. Suspendisse quis nunc ante. Suspendisse arcu est, rutrum a lobortis sed, sollicitudin eget est.`;

export const posts = [
    {
        date: new Date(Date.parse("2021-10-25 12:57")),
        author: "administrator",
        photo: "rusza-edycja-2022.jpg",
        title: "Rusza edycja 2022!",
        alias: "rusza-edycja-2022",
        content: fakeContent,
        excerpt:
            "Keszcze więcej wrażeń, jeszcze większy rozmach. W 2022 roku widzimy się dwa dni z rzędu! 09.04 - Time Trial, 10.04 - Wyścig ze startu wspólnego"
    },
    {
        date: new Date(Date.parse("2021-11-01 15:28")),
        author: "administrator",
        photo: "ruszaja-zapisy-do-zawodow-2022.jpg",
        title: "Ruszaja zapisy do zawodów 2022",
        alias: "ruszaja-zapisy-do-zawodow-2022",
        content: fakeContent,
        excerpt: "Rura na kocierz w przyszlym roku odbedzie sie na wiosne dlatego zapisu uruchamiamy juz teraz!"
    },
    {
        date: new Date(Date.parse("2021-11-07 06:13")),
        author: "administrator",
        photo: "film-z-prezentacji-trasy.jpg",
        title: "Film z prezentacji trasy",
        alias: "film-z-prezentacji-trasy",
        content: fakeContent,
        excerpt:
            "Mapki i słowo pisane nie do wszystkich przemawiają, przygotowaliśmy video prezentację tegorocznej trasy wyścigu!"
    },
    {
        date: new Date(Date.parse("2021-11-12 18:09")),
        author: "administrator",
        photo: "nowy-sponsor-zawodow-xyz-com.jpg",
        title: "Nowy sponsor zawodów - XYZ.com",
        alias: "nowy-sponsor-zawodow-xyz-com",
        content: fakeContent,
        excerpt:
            "Po negocjacjach w końcu udalo nam sie dojść do konsensusu, nawiązalismy wspołpracę z kolejnym sponsorem - tym razem jest to XYZ.com"
    }
];
