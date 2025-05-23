<?php

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$db = new PDO('sqlite:exceptions.db');

$db->query(
    "CREATE TABLE if not exists Xlxs(
    event_date TEXT NOT NULL PRIMARY KEY,
    description TEXT NOT NULL,
    work_day INTEGER)"
);

$allow = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['tables'])) {
    if (in_array($_FILES['tables']['type'], $allow)) {
        $spreadsheet = IOFactory::load($_FILES['tables']['tmp_name']);
        $sheetData = $spreadsheet->getActiveSheet()->removeRow(1)->toArray();
        $smth = $db->prepare("INSERT OR IGNORE INTO Xlxs(event_date, description, work_day) VALUES (?, ?, ?)");

        foreach ($sheetData as $row) {
            $date = DateTime::createFromFormat('Y-m-d', $row[0]);
            if (count($row) === 3 && $date && is_string($row[1]) && (is_numeric($row[2]) | is_null($row[2]))) {
                $smth->execute($row);
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $smth = $db->prepare("SELECT * FROM Xlxs");
    $smth->execute();
    $dates = $smth->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($dates);
}
