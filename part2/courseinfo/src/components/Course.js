import Header from './Header';
import Total from './Total';
import Content from './Content';

const Course = ( {course} ) => {
  const total = course.parts.reduce(
    (previousValue, currentValue) => previousValue + currentValue.exercises, 0);

  return ( 
    <div>
      <Header title={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
    </div> 
  );
}
 
export default Course;