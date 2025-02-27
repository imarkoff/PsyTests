import csv


def read_csv_as_matrix(file_path: str) -> list[list[any]]:
    """
    Read CSV file as matrix
    """

    with open(file_path, newline='') as csvfile:
        reader = csv.reader(csvfile)
        matrix = [row for row in reader]

    return matrix