<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
$conn = mysqli_connect("sql208.infinityfree.com", "if0_41132115", "Fbrn0naFEa6eu", "if0_41132115_apex_db");
if (!$conn) { die(json_encode(["error" => "fail"])); }
mysqli_query($conn, "UPDATE page_views SET view_count = view_count + 1 WHERE id = 1");
$res = mysqli_query($conn, "SELECT view_count FROM page_views WHERE id = 1");
$row = mysqli_fetch_assoc($res);
echo json_encode(["count" => $row['view_count']]);
mysqli_close($conn);
?>