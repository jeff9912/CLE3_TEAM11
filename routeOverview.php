<?php

if (isset($_POST['submit'])) {

    //    error neerzetten als post faalt
    //     error neerzetten als vertrek/eind niet ingevuld

}

$vertrekStation = $_POST['vertrek'];
$eindbestemming = $_POST['eindbestemming'];
$tijd = $_POST['tijd'];

print_r($tijd);
print_r($vertrekStation);
print_r($eindbestemming);
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Route</title>
    <link rel="stylesheet" href="css/styleVoorRoutePagina.css">
    <script type="text/javascript" src="scripts/main3.js" defer></script>

</head>
<body>
<header>
    <div class="richting">
        <h1> Richting <br> <?= $eindbestemming ?></h1>
        <h1 id="laatSpoorZien">6</h1>
    </div>
</header>
<main>

</main>
<footer>

</footer>
</body>
</html>